import puppeteer, { type LaunchOptions } from 'puppeteer'

const DEFAULT_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']

/**
 * Launch options for Puppeteer PDF rendering.
 * Uses PUPPETEER_EXECUTABLE_PATH when set; otherwise bundled Chrome from
 * `bun run install:chrome` (see root package.json).
 */
export function getPuppeteerLaunchOptions(): LaunchOptions {
	const opts: LaunchOptions = {
		headless: true,
		args: DEFAULT_ARGS,
	}
	const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH?.trim()
	if (fromEnv) {
		opts.executablePath = fromEnv
		return opts
	}
	try {
		const bundled = puppeteer.executablePath()
		if (bundled) opts.executablePath = bundled
	} catch {
		// executablePath() throws when Chrome is not installed — launch will fail with a clear error
	}
	return opts
}

export async function launchBrowser() {
	return puppeteer.launch(getPuppeteerLaunchOptions())
}
