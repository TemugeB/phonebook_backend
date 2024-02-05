require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')

const app = express()
app.use(cors())
app.use(express.static('dist')) //This will render the frontend
app.use(express.json())

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


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
    Entry.find({}).then(notes => {
        res.json(notes)
    })
    return res
})


app.get('/info', (req, res) => {

    return res.send(`
        <div>Phonebook has info for ${phonebook.length} people</div>
        <br>
        <div>${Date().toString()}</div>
    `)
})


app.get('/api/persons/:id', (req, res) => {

    //get the id of the request
    const id = Number(req.params.id)

    const person = phonebook.find(p => p.id === id)

    if (person){
        return res.json(person)
    }
    else{
        return res.status(404).end()
    }
})


/* ------------------------POST-------------------------*/
app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)

    if (!body.name){
        return res.status(400).json({error: "Name field is empty"})
    }
    else if (!body.number){
        return res.status(400).json({error: "Number field is empty"})
    }

    //Check if the name exists
    if (phonebook.find(p => p.name.toLowerCase() === body.name.toLowerCase())){
        return res.status(400).json({error: `Person with name ${body.name} already exists in database`})
    }

    const newEntry = {
        name: body.name,
        number: body.number,
        id: getNewId()
    }

    phonebook = phonebook.concat(newEntry)
    return res.json(newEntry)

})


/* -----------------------Delete -----------------------*/
app.delete('/api/persons/:id', (req, res) => {

    const id = Number(req.params.id)

    const filteredPhonebook = phonebook.filter(p => p.id !== id)
    if (filteredPhonebook.length == phonebook.length){
        return res.status(400).json({error: 'person does not exist in the database'})
    }

    //overwrite the existing phonebook
    phonebook = filteredPhonebook
    console.log(`Person with id '${id}' delete`)

    return res.status(204).end()
})



/* -------------------Helper Functions ---------------- */
const getNewId = () => {
    while(true){
        const newId = Math.trunc(Math.random() * 10000)
        if(!phonebook.find(p => p.id === newId)){
            return newId
        }
    }
}


//When no endpoint exist
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`server running on port ${PORT}`)