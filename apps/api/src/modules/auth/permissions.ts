import { shield, allow } from 'graphql-shield'

const isAuthenticated = () => true

export const permissions = () => shield({
	Query: {
		'*': allow,
	},
	Mutation: {
		'*': allow,
	},
}, {
	allowExternalErrors: true,
})
