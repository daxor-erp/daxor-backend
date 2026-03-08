const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

if (process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true') {
	console.log('⏭️  Skipping Chromium installation')
	process.exit(0)
}

const chromePath = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome')
const chromeExists = fs.existsSync(chromePath) && fs.readdirSync(chromePath).length > 0

if (chromeExists) {
	console.log('✅ Chromium already installed, skipping download')
	process.exit(0)
}

console.log('📦 Installing Chromium for Puppeteer...')

try {
	execSync('bunx puppeteer browsers install chrome', { stdio: 'inherit' })
	console.log('✅ Chromium installed successfully')
} catch (error) {
	console.error('❌ Failed to install Chromium:', error.message)
	if (!process.env.CI) process.exit(1)
}
