import pkg from 'lodash'
const { merge } = pkg

import instrument from './instruments/index.js'
import sample from './samples/index.js'
import test_parameter from './test_parameters/index.js'
import test from './tests/index.js'
import user from './users/index.js'

const typeDef = `#graphql
  type Query
  type Mutation
`
const typeDefs =
  typeDef +
  user.typeDefs +
  test.typeDefs +
  sample.typeDefs +
  test_parameter.typeDefs +
  instrument.typeDefs

let resolvers = {}

resolvers = merge(
  resolvers,
  user.resolvers,
  test.resolvers,
  sample.resolvers,
  test_parameter.resolvers,
  instrument.resolvers
)

export { resolvers, typeDefs }
