require('dotenv').config()
const express = require('express')
const { response } = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
const Number = require('./models/number')

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

let numbers = [
    {
        name: "Arto",
        number: "040",
        id: 1
    },
    {
        name: "sanna",
        number: "05",
        id: 2
    }
]

app.get('/', (req, res) => {
    res.send('<h1>moro</h1>')
})

app.get('/api/persons', (req, res) => {
    Number.find({}).then(numbers => {
        res.json(numbers)
    }) 
})

app.get('/info', (req, res, next) => {
    
    Number.find({}).then(numbers => {
        let amount = numbers.length
        let date = new Date()
        res.send(`<p>Phonebook has info for ${amount} people</p><p>${date}</p>`)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Number.findById(req.params.id).then(n => {
        if (n) {
            res.json(n)
        } else {
           res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Number.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        }).catch(error => next(error))   
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    
    const number = {
        name: body.name,
        number: body.number
    }
    
    Number.findByIdAndUpdate(req.params.id, number, { new:true })
        .then(updatedNumber => {
            res.json(updatedNumber)
    }).catch(error => next(error))
}) 

app.post('/api/persons', (req, res, next) => {
    const body = req.body
   
    const number = new Number({
        name: body.name,
        number: body.number,
    })
    
    number.save().then(savedNumber => {
        res.json(savedNumber)
    }).catch(error => next(error))

})

const unkownEndpoint = (req, res) => {
    response.status(404).send({ error: 'unknown endpoint' })

}

app.use(unkownEndpoint)


const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running')
})