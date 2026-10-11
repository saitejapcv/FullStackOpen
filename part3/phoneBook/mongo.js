const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const argname = process.argv[3]

const argnum = process.argv[4]

const url = `mongodb+srv://saitejapcv:${password}@cluster0.nlfol9p.mongodb.net/PhoneBookApp?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    Person.find({}).then(result => {
        if (result.length === 0) {
            console.log('No note')
        }
        console.log(`phonebook:`)
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
else {
    const person = new Person({
        name: argname,
        number: argnum,
    })

    person.save().then(result => {
        console.log(`added ${argname} ${argnum} to phonebook`)
        mongoose.connection.close()
    })
}
