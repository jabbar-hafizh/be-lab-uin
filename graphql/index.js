import pkg from 'lodash'
const { merge } = pkg

import user from './users/index.js'

const typeDef = `#graphql
  type Query
  type Mutation
`
const typeDefs = typeDef + user.typeDefs

let resolvers = {}

resolvers = merge(resolvers, user.resolvers)

const graphQLIndex = {
  typeDefs,
  resolvers
}
export {resolvers, typeDefs}
