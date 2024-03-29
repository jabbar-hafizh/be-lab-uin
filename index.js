import dotenv from 'dotenv'
dotenv.config()

// Load Moment.js and Moment Timezone libraries (make sure they're included in your project)
import moment from 'moment-timezone'
;('moment-timezone')

// Set the global default time zone to Asia/Jakarta
const jakartaTimezone = 'Asia/Jakarta'
moment.tz.setDefault(jakartaTimezone)

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import bodyParser from 'body-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import { applyMiddleware } from 'graphql-middleware'
import http from 'http'

import { connectToDatabase } from './connection.js'
import { resolvers, typeDefs } from './graphql/index.js'
import { loaders } from './loaders/index.js'
import authMiddleware from './middlewares/auth-middleware.js'
import permissionMiddleware from './middlewares/permission-middleware.js'
import rest_api from './rest_api/routes.js'

connectToDatabase()

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(express.static(process.cwd() + '/public'))
app.disable('x-powered-by')

rest_api(app)

const httpServer = http.createServer(app)
const executableSchema = makeExecutableSchema({ typeDefs, resolvers })
const protectedSchema = applyMiddleware(
  executableSchema,
  authMiddleware,
  permissionMiddleware
)

const server = new ApolloServer({
  schema: protectedSchema,
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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

await server.start()
app.use(
  '/',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: req => ({
      req: req.req,
      loaders: loaders()
    })
  })
)

await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve))

console.log(`🚀 Server ready!`)

export default app
