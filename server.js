const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

const PORT = process.env.PORT || 8020

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App running on port ${PORT}...`)
})
