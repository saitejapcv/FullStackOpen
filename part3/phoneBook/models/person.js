const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log('Connecting to ', url)

mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB', error.message)
    })


personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d+$/.test(v)
            }
        },
        required: true,
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
