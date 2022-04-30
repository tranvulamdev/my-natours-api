const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
    console.log(err.name, err.message)
    console.log('UNCAUGHT EXCEPTION! 😭 Shutting down...')

    process.exit(1)
})

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD)

mongoose
    .connect(DB)
    .then(() => console.log('Database connection successfully!'))
// .catch(() => console.log('Database connection failure :('))

const app = require('./app')

const PORT = process.env.PORT || 8020

const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`)
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('UNHANDLER REJECTION! 😭 Shutting down...')

    // server.close => gice server time to finish all req that are still pending
    // or being handled at the time
    // only after that, the server is then basically killed
    server.close(() => {
        process.exit(1)
    })
})
