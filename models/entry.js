const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 9,
        validate: {
            validator: (v) => {
                //Dont know REGEX (╥﹏╥)
                //ChatGPT can do this. ⸜(｡˃ ᵕ ˂ )⸝♡
                const phoneRegex = /^(?:\d{2,3})-(?:\d+)$/
                return phoneRegex.test(v)
            },
            message: props => `${props.value} is not valid. Accepted formats: xxx-xxxxx, xx-xxxxxx, with min length of 8.`
        },
        required: true,
    }
})

entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Entry', entrySchema)