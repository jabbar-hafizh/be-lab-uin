import pkg from 'lodash'
const { merge } = pkg

import instrument from './instruments/index.js'
import sample from './samples/index.js'
import stock_opname_history from './stock_opname_histories/index.js'
import stock_opname from './stock_opnames/index.js'
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
  instrument.typeDefs +
  stock_opname.typeDefs +
  stock_opname_history.typeDefs

let resolvers = {}

resolvers = merge(
  resolvers,
  user.resolvers,
  test.resolvers,
  sample.resolvers,
  test_parameter.resolvers,
  instrument.resolvers,
  stock_opname.resolvers,
  stock_opname_history.resolvers
)

export { resolvers, typeDefs }
