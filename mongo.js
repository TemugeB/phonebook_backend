const mongoose = require('mongoose')

if (process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
//const url = `mongodb+srv://temugebatpurev:${password}@cluster0.dqbdvn5.mongodb.net/phonebook?retryWrites=true&w=majority`
const url = `mongodb+srv://aichi_linux:${password}@cluster0.dqbdvn5.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry', noteSchema)

if (process.argv.length == 3){

    console.log('Phonebook:')
    Entry.find({}).then( result => {
        result.forEach(entry => {
            console.log(entry.name, entry.number)
        })
        mongoose.connection.close()
    })

}

else if (process.argv.length == 5){
    const entry = new Entry({
        name: process.argv[3],
        number: process.argv[4]
    })

    entry.save().then(result => {
        console.log('entry saved!')
        mongoose.connection.close()
    })

}    

else {
    console.log('Incorrect number of arguments to the function.')
    process.exit(1)
}    


