import nodemailer from 'nodemailer'
import { config } from '~/config'
import { logger } from '~/lib/logger'

export function isSmtpConfigured(): boolean {
	return Boolean(config.email.user && config.email.password)
}

/**
 * Sends mail over SMTP using Nodemailer.
 * Port 465: implicit TLS (secure: true). Port 587: STARTTLS (secure: false, requireTLS: true).
 */
export async function sendHtmlEmail(params: { to: string; subject: string; html: string; text: string }): Promise<void> {
	const { host, port, user, password, from } = config.email
	if (!user || !password) {
		throw new Error(
			'SMTP is not configured. Set EMAIL_USER and EMAIL_PASSWORD (and optionally EMAIL_HOST, EMAIL_PORT, EMAIL_FROM).',
		)
	}

	const secure = port === 465
	const transporter = nodemailer.createTransport({
		host,
		port,
		secure,
		auth: { user, pass: password },
		connectionTimeout: 30_000,
		greetingTimeout: 15_000,
		...(!secure ? { requireTLS: true as const } : {}),
	})

	try {
		await transporter.sendMail({
			from,
			to: params.to,
			subject: params.subject,
			html: params.html,
			text: params.text,
		})
		logger.info(`SMTP: sent mail to ${params.to} subject "${params.subject.slice(0, 80)}"`)
	} catch (err) {
		logger.error('SMTP sendMail failed', err)
		throw err
	} finally {
		transporter.close()
	}
}
