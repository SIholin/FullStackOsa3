const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

if (process.argv.length < 3) {
    console.log('give password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.nucki.mongodb.net/number-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const numberSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    number: { type: String, required: true }
})

numberSchema.plugin(uniqueValidator)

const Number = mongoose.model('Number', numberSchema)

if(process.argv.length < 4) {
    console.log("phonebook:")
    Number.find({}).then(result => {
        result.forEach(n => {
            console.log(n.name, n.number)
        })
        mongoose.connection.close()
    })
} else {
    const number = new Number({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    
    
    number.save().then(response => {
        console.log('added', number.name, "number", number.number, "to phonebook")
        mongoose.connection.close()
    })
}



