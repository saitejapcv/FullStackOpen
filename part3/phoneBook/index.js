require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

// let persons = [
//     {
//         "id": "1",
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": "2",
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": "3",
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": "4",
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res) => {
    // res.json(persons)
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    const now = new Date()
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}</p>`)
    })
    // res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}</p>`)
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    // const person = persons.find(person => person.id === id)
    // if (person) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }
    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        }
        else {
            res.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    // persons = persons.filter(person => person.id !== id)

    // res.status(204).end()

    Person.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.status(204).end()
            }
            else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

// const generateId = () => {
//     const maxId = Math.floor(Math.random() * 1000)
//     return String(maxId)
// }
app.post('/api/persons', (req, res, next) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "content missing"
        })
    }

    Person.findOne({ name: body.name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({
                error: "Name must be unique"
            })
        }


        const person = new Person({
            name: body.name,
            number: body.number
        })

        person.save().then(savedPerson => {
            res.json(savedPerson)
        })
            .catch(error => next(error))
    })

    // const findPerson = persons.find(person => person.name === body.name)

    // if (findPerson) {
    //     return res.status(400).json({
    //         error: "Name must be unique"
    //     })
    // }
    // const person = {
    //     name: body.name,
    //     number: body.number,
    //     id: generateId(),
    // }

    // persons = persons.concat(person)

    // res.json(person)
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body
    Person.findById(req.params.id)
        .then(person => {
            if (!person) {
                return res.status(404).end()
            }

            person.name = name
            person.number = number

            person.save().then(updatedPerson => {
                res.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)

const ErrorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Malformated error' })
    }
    if (error.name == 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(ErrorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})
