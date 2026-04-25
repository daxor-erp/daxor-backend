module.exports = {
	apps: [
		/**
		 * Production Process
		 */
		{
			name: 'api.daxor.in',
			cwd: 'apps/api',
			script: 'bun',
			args: 'run prod',
			interpreter: 'none',
			watch: false,
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
