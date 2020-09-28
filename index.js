const express = require('express')
const { response } = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static('build'))

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
    res.json(numbers)
})

app.get('/info', (req, res) => {
    let amount = numbers.length
    let date = new Date()
    res.send(`<p>Phonebook has info for ${amount} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const number = numbers.find(n => n.id === id)

    if (number) {
        res.json(number)
    } else {
        res.status(404).end()
    }
  
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    numbers = numbers.filter(n => n.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const number = req.body
   
    if(!number.name || !number.number ) {
        return res.status(400).json({
            error: 'number or name missing'
        })
    }

    if(numbers.find(n => n.name == number.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = Math.random(100000)
    number.id = id

    numbers = numbers.concat(number)

    res.json(number)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server running')
})