import puppeteer from 'puppeteer'
import { injectable } from 'tsyringe'

@injectable()
export class PDFService {
	async generatePDF(html: string, options?: any): Promise<Buffer> {
		const browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		})

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
