const express = require('express')

const connectDB = require('./data/db')

const apiRoute = require('./routes/api').route

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api', apiRoute)

const PORT = process.env.PORT || 2020

app.listen(PORT,()=>{
    console.log(`started at http://localhost:${PORT}`)
})