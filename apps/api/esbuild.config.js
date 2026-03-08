const esbuild = require('esbuild')

esbuild.build({
	entryPoints: ['./src/index.ts'],
	bundle: true,
	platform: 'node',
	target: 'node22',
	outfile: 'dist/index.js',
	external: ['mongoose', 'express', 'graphql', 'puppeteer'],
	format: 'esm',
	sourcemap: true,
}).catch(() => process.exit(1))
