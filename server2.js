import dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'

import { resolvers, typeDefs } from './graphql.js'
import { loaders } from './loaders/index.js'
import { authMiddleware, userLogMiddleware } from './middlewares/index.js'

import { connectToDatabase } from './connection.js'

// Connect to the database
connectToDatabase()

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(userLogMiddleware)

const executableSchema = makeExecutableSchema({ typeDefs, resolvers })
const protectedSchema = applyMiddleware(executableSchema, authMiddleware)

const apolloServer = new ApolloServer({
  schema: protectedSchema,
  typeDefs,
  resolvers,
  debug: process.env.APOLLO_SERVER_DEBUG || true,
  playground: process.env.APOLLO_SERVER_PLAYGROUND || true,
  introspection: process.env.APOLLO_SERVER_INTROSPECTION || true,
  formatError: err => {
    return err
  },
  formatResponse: (response, requestContext) => {
    if (requestContext.response && requestContext.response.http) {
      requestContext.response.http.headers.set(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
      requestContext.response.http.headers.set('Pragma', 'no-cache')
      requestContext.response.http.headers.set('Expires', '0')
      requestContext.response.http.headers.set('X-Content-Type-Options', 'nosniff')
    }

    return response
  },
  context: req => ({
    req: req.req,
    loaders: loaders()
  })
})

apolloServer.applyMiddleware({ app, path: '/graphql' })

const PORT = process.env.PORT || 8001

app.listen(PORT, () => {
  console.log('graphql api is running...', apolloServer.graphqlPath)
})
