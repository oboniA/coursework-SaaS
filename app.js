// import libraries
const express = require('express')
const res = require('express/lib/response')
const app = express()

// import mongoose library for database
const mongoose = require('mongoose')

require('dotenv/config')

const bodyParser = require('body-parser')
app.use(bodyParser.json())




// signin and registration endpoints
const userauthRoute = require('./routes/user-auth')
app.use('/api/user', userauthRoute)

// Posts Endpoints
const postsRoute = require('./routes/posts')
app.use('/api/posts', postsRoute)


// connects to mongoDB cluster
mongoose.connect(process.env.DB_CONNECTOR,  { //database location in .env
    useNewUrlParser: true
  })
  .then(() => {
    console.log('mongoDB is now connected') //callback
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })
  
// server port
app.listen(3000, ()=> {
    console.log('Server is up and running...') //callback
})