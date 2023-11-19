const express = require('express')
const res = require('express/lib/response')
const app = express()

//Middleware
const postsRoute = require('./routes/posts')
app.use('/posts', postsRoute)

app.get('/', (req, res) => {
    res.send('HOMEPAGE')
})

app.listen(3000, ()=> {
    console.log('Server is up and running...') //callback
})