import dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { connectToDatabase } from './connection.js'
import { resolvers, typeDefs } from './graphql/index.js'

connectToDatabase()

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT }
})

console.log(`🚀  Server ready at: ${url}`)
