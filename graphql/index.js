import pkg from 'lodash'
const { merge } = pkg

import user from './users/index.js'
import test from './tests/index.js'

const typeDef = `#graphql
  type Query
  type Mutation
`
const typeDefs = typeDef + user.typeDefs + test.typeDefs

let resolvers = {}

resolvers = merge(resolvers, user.resolvers, test.resolvers)

export { resolvers, typeDefs }
