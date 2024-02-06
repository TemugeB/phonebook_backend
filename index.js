require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')

const app = express()
app.use(cors())
app.use(express.static('dist')) //This will render the frontend
app.use(express.json())


// //need to register this callback before defining the other app methods
// const requestLogger = (req, res, next) => {
//     console.log('Method:', req.method)
//     console.log('Path:', req.path)
//     console.log('Body:', req.body)
//     console.log('-----')
//     next()
// }
// app.use(requestLogger)

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] :body - :response-time ms'))


/** -----------------GET----------------- **/

// app.get('/', (req, res) => {
//     return res.send('<h1>Hello World </h1>')
// })

app.get('/api/persons', (req, res) => {
    Entry.find({}).then(entries => {
        res.json(entries)
    })
    return res
})


app.get('/info', (req, res) => {

    Entry.find({}).then(entries => {
        res.send(`
        <div>Phonebook has info for ${entries.length} people</div>
        <br>
        <div>${Date().toString()}</div>
        `)
    })
})


app.get('/api/persons/:id', (req, res, next) => {

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


/* ------------------------POST-------------------------*/
app.post('/api/persons', (req, res, next) => {
    const body = req.body
    console.log(body)

    if (!body.name){
        return res.status(400).json({error: "Name field is empty"})
    }
    else if (!body.number){
        return res.status(400).json({error: "Number field is empty"})
    }

    const entry = new Entry({
        name: body.name,
        number: body.number
    })

    entry.save().then(savedEntry => {
        res.json(savedEntry)
    })
    .catch(error=> next(error))

    // phonebook = phonebook.concat(newEntry)
    // return res.json(newEntry)
    return res
})


/* -----------------------Delete -----------------------*/
app.delete('/api/persons/:id', (req, res, next) => {

    Entry.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})


/*------------------------Update------------------------*/
app.put('/api/persons/:id', (req, res, next) => {

    const body = req.body

    const entry = {
        name: body.name,
        number: body.number
    }

    Entry.findByIdAndUpdate(req.params.id, entry, {new: true})
        .then(updatedEntry => {
            res.json(updatedEntry)
        })
        .catch(error => next(error))
})


//When no endpoint exist
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`server running on port ${PORT}`)