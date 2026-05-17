import http from 'node:http'
import express from 'express'
import { GraphQLServer } from './graphql'
import { configureMiddleware } from '~/middlewares'
import { errorHandler } from '~/middlewares/error-handler.middleware'
import jwt from 'jsonwebtoken'
import { config } from '~/config'
import { UserRepository } from '~/modules/user/repository'
import { PDFService } from '~/modules/pdf/service'
import { renderDocumentToHtml } from '~/modules/pdf/document-renderer'
import { isPdfDocumentType, PDF_DOCUMENT_TYPES } from '~/modules/pdf/templates'
import { DocumentService } from '~/modules/document/service'

const userRepo = new UserRepository()

async function resolveAuthedUser(req: express.Request): Promise<{ id: string; organizationId: string | null; isPlatformAdmin: boolean } | null> {
	const token = req.headers.authorization?.replace('Bearer ', '')
	if (!token) return null
	try {
		const decoded = jwt.verify(token, config.jwtSecret) as { id?: string; roles?: string[] }
		if (!decoded?.id) return null
		const dbUser = await userRepo.findById(String(decoded.id))
		if (!dbUser || dbUser.deletedAt) return null
		const roles: string[] = Array.isArray(dbUser.roles) ? dbUser.roles.map(String) : (decoded.roles ?? []).map(String)
		const isPlatformAdmin = roles.includes('SUPER_ADMIN') || roles.includes('ERP_ADMIN')
		return {
			id: String(dbUser._id ?? decoded.id),
			organizationId: dbUser.organizationId != null ? String(dbUser.organizationId) : null,
			isPlatformAdmin,
		}
	} catch {
		return null
	}
}
import fs from 'node:fs'

export class Server {
	private httpServer: http.Server
	private app: express.Application
	private graphqlServer: GraphQLServer

	constructor() {
		this.app = express()
		this.httpServer = http.createServer(this.app)
		this.graphqlServer = new GraphQLServer(this.app, this.httpServer)

		this.configureMiddleware()
		this.configureRoutes()
		this.configureGraphQL()
		this.configureErrorHandling()
	}

	private async configureGraphQL(): Promise<void> {
		await this.graphqlServer.initialize()
	}

	private configureMiddleware(): void {
		configureMiddleware(this.app)
	}

	private configureRoutes(): void {
		this.app.get('/ping', (_, res) => {
			res.status(200).send('pong')
		})

		this.app.get('/api', (_, res) => {
			res.json({ message: 'Daxor API' })
		})

		// PDF generation — render arbitrary HTML to a downloadable PDF via Puppeteer/Chromium.
		this.app.post(
			'/api/pdf',
			express.json({ limit: '10mb' }),
			async (req, res) => {
				try {
					const { html, filename, options } = (req.body ?? {}) as {
						html?: string
						filename?: string
						options?: Record<string, unknown>
					}
					if (!html || typeof html !== 'string') {
						return res.status(400).json({ error: 'html required (string)' })
					}
					const pdfService = new PDFService()
					const pdf = await pdfService.generatePDF(html, options ?? {})
					const safe = (filename || 'document').replace(/[^a-z0-9_.-]+/gi, '-') || 'document'
					res.setHeader('Content-Type', 'application/pdf')
					res.setHeader(
						'Content-Disposition',
						`attachment; filename="${safe.endsWith('.pdf') ? safe : safe + '.pdf'}"`,
					)
					res.send(pdf)
				} catch (err) {
					console.error('PDF generation failed', err)
					res.status(500).json({ error: 'PDF generation failed' })
				}
			},
		)

		// Document PDF — fetch by type+id, render the matching template, stream PDF.
		this.app.post(
			'/api/pdf/document',
			express.json({ limit: '1mb' }),
			async (req, res) => {
				try {
					const user = await resolveAuthedUser(req)
					if (!user) return res.status(401).json({ error: 'Authentication required' })

					const { type, id } = (req.body ?? {}) as { type?: string; id?: string }
					if (!type || !id) return res.status(400).json({ error: 'type and id are required' })
					if (!isPdfDocumentType(type)) {
						return res.status(400).json({ error: `unsupported type. Use one of: ${PDF_DOCUMENT_TYPES.join(', ')}` })
					}

					const { html, filename } = await renderDocumentToHtml(type, String(id), {
						userOrganizationId: user.organizationId,
						isPlatformAdmin: user.isPlatformAdmin,
					})
					const pdfService = new PDFService()
					const pdf = await pdfService.generatePDF(html)
					const safe = filename.replace(/[^a-z0-9_.-]+/gi, '-')
					res.setHeader('Content-Type', 'application/pdf')
					res.setHeader('Content-Disposition', `attachment; filename="${safe}.pdf"`)
					res.send(pdf)
				} catch (err: any) {
					const msg = String(err?.message || 'PDF generation failed')
					const status = msg.startsWith('Forbidden') ? 403 : msg.includes('not found') ? 404 : 500
					console.error('document PDF failed', err)
					res.status(status).json({ error: msg })
				}
			},
		)

		// Document upload (base64 JSON, swap-friendly for multipart later)
		const documentService = new DocumentService()
		this.app.post(
			'/api/documents/upload',
			express.json({ limit: '30mb' }),
			async (req, res) => {
				try {
					const body = (req.body ?? {}) as {
						organizationId?: string
						parentModule?: string
						parentId?: string
						filename?: string
						mimeType?: string
						base64?: string
						category?: string
						description?: string
						uploadedByUserId?: string
					}
					if (!body.organizationId || !body.parentModule || !body.parentId || !body.filename || !body.base64) {
						return res.status(400).json({
							error: 'organizationId, parentModule, parentId, filename and base64 are required',
						})
					}
					const doc = await documentService.uploadBase64({
						organizationId: body.organizationId,
						parentModule: body.parentModule,
						parentId: body.parentId,
						filename: body.filename,
						mimeType: body.mimeType,
						base64: body.base64,
						category: body.category,
						description: body.description,
						uploadedByUserId: body.uploadedByUserId,
					})
					res.json({
						id: String((doc as any)?._id ?? (doc as any)?.id ?? ''),
						filename: doc.filename,
						mimeType: doc.mimeType,
						sizeBytes: doc.sizeBytes,
						downloadUrl: `/api/documents/${String((doc as any)?._id ?? (doc as any)?.id ?? '')}/download`,
						createdAt: doc.createdAt,
					})
				} catch (err: any) {
					console.error('Document upload failed', err)
					res.status(400).json({ error: err?.message || 'Upload failed' })
				}
			},
		)

		// Document download — streams the file from disk
		this.app.get('/api/documents/:id/download', async (req, res) => {
			try {
				const found = await documentService.getReadable(String(req.params.id))
				if (!found) return res.status(404).json({ error: 'Not found' })
				const { doc, absolutePath } = found
				if (doc.mimeType) res.setHeader('Content-Type', String(doc.mimeType))
				res.setHeader(
					'Content-Disposition',
					`inline; filename="${String(doc.filename ?? 'file').replace(/[^a-z0-9_.-]+/gi, '-')}"`,
				)
				fs.createReadStream(absolutePath).pipe(res)
			} catch (err) {
				console.error('Document download failed', err)
				res.status(500).json({ error: 'Download failed' })
			}
		})
	}

	private configureErrorHandling(): void {
		this.app.use(errorHandler)
	}

	public getApp(): express.Application {
		return this.app
	}

	public getHttpServer(): http.Server {
		return this.httpServer
	}

	public async stop(): Promise<void> {
		this.httpServer.close()
		console.debug('Server stopped')
	}
}
