const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const entriesRouter = require('./controllers/entries')
const infosRouter = require('./controllers/infos')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('Connecting to: ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.info('error connecting to MongoDB', error.message)
    })


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)


//requests to DB
app.use('/api/persons', entriesRouter)
app.use('/info', infosRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
