const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

if (process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true') {
	console.log('⏭️  Skipping Chromium installation')
	process.exit(0)
}

const cacheDir = process.env.PUPPETEER_CACHE_DIR || path.join(os.homedir(), '.cache', 'puppeteer')
const chromeRoot = path.join(cacheDir, 'chrome')

/** Remove platform folders that exist but have no chrome binary (failed/interrupted download). */
function pruneBrokenChromeInstalls() {
	if (!fs.existsSync(chromeRoot)) return
	for (const entry of fs.readdirSync(chromeRoot)) {
		const platformDir = path.join(chromeRoot, entry)
		if (!fs.statSync(platformDir).isDirectory()) continue
		const candidates = [
			path.join(platformDir, 'chrome-linux64', 'chrome'),
			path.join(platformDir, 'chrome-mac', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
			path.join(platformDir, 'chrome-win64', 'chrome.exe'),
		]
		const hasBinary = candidates.some((p) => fs.existsSync(p))
		if (!hasBinary) {
			console.log(`🧹 Removing incomplete Chrome install: ${platformDir}`)
			fs.rmSync(platformDir, { recursive: true, force: true })
		}
	}
}

console.log('📦 Installing Chrome for Puppeteer (cache: %s)...', cacheDir)
pruneBrokenChromeInstalls()

try {
	execSync('bunx puppeteer browsers install chrome', {
		stdio: 'inherit',
		env: { ...process.env, PUPPETEER_CACHE_DIR: cacheDir },
	})
	console.log('✅ Chrome installed successfully')
} catch (error) {
	console.error('❌ Failed to install Chrome:', error.message)
	console.error('   Run manually: cd daxor-backend && bun run install:chrome')
	if (!process.env.CI) process.exit(1)
}
