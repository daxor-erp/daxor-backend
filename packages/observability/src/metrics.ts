export const metrics = {
	addMetric: (name: string, value: number, unit: string) => {
		console.log(`[METRIC] ${name}: ${value} ${unit}`)
	},
}
