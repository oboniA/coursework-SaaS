// import libraries
const express = require('express')
const res = require('express/lib/response')
const app = express()

// import mongoose library for database
const mongoose = require('mongoose')

// initiated .env file
require('dotenv/config')

const bodyParser = require('body-parser')
app.use(bodyParser.json())


// Required Routes
const userauthRoute = require('./routes/user-auth')
const homeRoute = require('./routes/home')
const postCreateRoute = require('./routes/postRoute')
const postBrowse = require('./routes/browseRoute')
const postLike = require('./routes/likeRoute')
const postDislike = require('./routes/dislikeRoute')
const postComment = require('./routes/commentsRoute')
const maxinteraction = require('./routes/highestRoute')
const editPosts = require('./routes/editpostRoute')

// API End-Points for all routes
app.use('/api/user', userauthRoute)
app.use('/api/home', homeRoute)
app.use('/api/home/post', postCreateRoute)
app.use('/api/home/allposts', postBrowse)
app.use('/api/home/allposts', postLike)  // /api/posts/:postId/likepost
app.use('/api/home/allposts', postDislike)  // /api/posts/:postId/dislikepost
app.use('/api/home/allposts', postComment)  // /api/posts/:postId/comment
app.use('/api/home/allposts', maxinteraction)
app.use('/api/home/allposts', editPosts)


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