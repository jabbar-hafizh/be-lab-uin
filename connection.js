import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

const dbURI = process.env.DB_URI

const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`Mongoose connected to ${dbURI}`)
  } catch (error) {
    console.error('Mongoose connection error:', error)
  }
}

const disconnectFromDatabase = () => {
  mongoose.disconnect(() => {
    console.log('Mongoose disconnected')
  })
}

// Handle graceful shutdown of the connection
process.on('SIGINT', () => {
  disconnectFromDatabase()
  process.exit(0)
})

export { connectToDatabase, disconnectFromDatabase }
