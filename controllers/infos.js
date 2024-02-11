const infosRouter = require('express').Router()
const Entry = require('../models/entry')
const logger = require('../utils/logger')


infosRouter.get('/', (req, res) => {

    Entry.find({}).then(entries => {
        res.send(`
        <div>Phonebook has info for ${entries.length} people</div>
        <br>
        <div>${Date().toString()}</div>
        `)
    })
})

module.exports = infosRouter