import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

export function validationDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
	return schema
}
