import fs from 'node:fs/promises'
import path from 'node:path'
import { GraphQLValidationError } from '@repo/errors'
import { DocumentRepository } from './repository'

const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads')

export interface CreateDocumentInput {
	organizationId: string
	parentModule: string
	parentId: string
	filename: string
	mimeType?: string
	base64: string
	uploadedByUserId?: string
	category?: string
	description?: string
}

export interface DocumentMetaInput {
	organizationId: string
	parentModule: string
	parentId: string
	uploadedByUserId?: string
	category?: string
	description?: string
}

export class DocumentService {
	private repository: DocumentRepository

	constructor() {
		this.repository = new DocumentRepository()
	}

	/**
	 * Persist a base64-encoded file payload to disk + record metadata in Mongo.
	 * Files are isolated per organization (uploads/<orgId>/<docId><ext>).
	 */
	async uploadBase64(input: CreateDocumentInput): Promise<any> {
		const { organizationId, parentModule, parentId, filename, mimeType, base64, uploadedByUserId, category, description } = input

		if (!organizationId) throw new GraphQLValidationError('organizationId is required')
		if (!parentModule || !parentId) throw new GraphQLValidationError('parentModule and parentId are required')
		if (!filename?.trim()) throw new GraphQLValidationError('filename is required')

		const cleaned = base64.includes(',') ? base64.split(',', 2)[1] : base64
		if (!cleaned) throw new GraphQLValidationError('Empty file payload')
		const buffer = Buffer.from(cleaned, 'base64')
		if (buffer.length === 0) throw new GraphQLValidationError('Empty file payload')
		if (buffer.length > 25 * 1024 * 1024) {
			throw new GraphQLValidationError('File exceeds 25 MB limit')
		}

		const orgDir = path.join(UPLOAD_ROOT, String(organizationId))
		await fs.mkdir(orgDir, { recursive: true })

		const safeName = filename.replace(/[^a-zA-Z0-9_.-]+/g, '-').slice(0, 120)
		const ext = path.extname(safeName) || ''
		const docId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
		const storedFile = `${docId}${ext}`
		const storagePath = path.join(orgDir, storedFile)
		await fs.writeFile(storagePath, buffer)

		return this.repository.create({
			organizationId,
			parentModule,
			parentId,
			filename: safeName,
			mimeType: mimeType ?? null,
			sizeBytes: buffer.length,
			storagePath,
			category,
			description,
			uploadedByUserId,
		})
	}

	async getReadable(id: string): Promise<{ doc: any; absolutePath: string } | null> {
		const doc = await this.repository.findById(id)
		if (!doc || doc.deletedAt) return null
		try {
			await fs.access(doc.storagePath)
		} catch {
			return null
		}
		return { doc, absolutePath: doc.storagePath }
	}

	async listForParent(parentModule: string, parentId: string) {
		return this.repository.listForParent(parentModule, parentId)
	}

	async listForOrganization(organizationId: string, parentModule?: string) {
		return this.repository.listForOrganization(organizationId, parentModule)
	}

	async findById(id: string) {
		return this.repository.findById(id)
	}

	async softDelete(id: string): Promise<any | null> {
		const doc = await this.repository.findById(id)
		if (!doc || doc.deletedAt) return null
		await this.repository.softDelete(id)
		// Best-effort disk cleanup
		try {
			if (doc.storagePath) await fs.unlink(doc.storagePath)
		} catch {
			// swallowed — soft-delete still succeeds
		}
		return doc
	}
}
