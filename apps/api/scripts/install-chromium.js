const { execSync } = require('child_process')

console.log('Installing Chromium for Puppeteer...')

try {
	execSync('bunx puppeteer browsers install chrome', { stdio: 'inherit' })
	console.log('✅ Chromium installed successfully')
} catch (error) {
	console.error('❌ Failed to install Chromium:', error.message)
	process.exit(1)
}
