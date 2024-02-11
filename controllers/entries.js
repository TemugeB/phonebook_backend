const entriesRouter = require('express').Router()
const Entry = require('../models/entry')
const logger = require('../utils/logger')


entriesRouter.get('/', (req, res) => {
    Entry.find({}).then(entries => {
        res.json(entries)
    })
    return res
})

entriesRouter.get('/:id', (req, res, next) => {

    Entry.findById(req.params.id)
        .then(entry => {
            if (entry){
                res.json(entry)
            }
            else{
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

entriesRouter.post('/', (req, res, next) => {
    const body = req.body
    console.log(body)

    const entry = new Entry({
        name: body.name,
        number: body.number
    })

    entry.save().then(savedEntry => {
        res.json(savedEntry)
    })
        .catch(error => next(error))
})


entriesRouter.delete('/:id', (req, res, next) => {

    Entry.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))

})


/*------------------------Update------------------------*/
entriesRouter.put('/:id', (req, res, next) => {

    const body = req.body

    const entry = {
        name: body.name,
        number: body.number
    }

    Entry.findByIdAndUpdate(req.params.id, entry, { new: true, runValidators: true })
        .then(updatedEntry => {
            res.json(updatedEntry)
        })
        .catch(error => next(error))
})

module.exports = entriesRouter