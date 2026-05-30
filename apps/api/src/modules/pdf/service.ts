import { injectable } from 'tsyringe'
import { launchBrowser } from '~/lib/puppeteer-launch'

@injectable()
export class PDFService {
	async generatePDF(html: string, options?: any): Promise<Buffer> {
		const browser = await launchBrowser()

		try {
			const page = await browser.newPage()
			await page.setContent(html, { waitUntil: 'networkidle0' })
			
			const pdf = await page.pdf({
				format: 'A4',
				printBackground: true,
				margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
				...options
			})

			return Buffer.from(pdf)
		} finally {
			await browser.close()
		}
	}
}
