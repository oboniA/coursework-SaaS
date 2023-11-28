// import libraries
const express = require('express')
const router = express.Router()

// import Post Model
const Post = require('../models/Post')

// import verifyAccessToken file
const verifyToken = require('../verifyAccessToken')

// callback
router.get('/', verifyToken, (req, res) => {
    try{
        const posts = Post.postsFeed()  // fetch posts from Post Model
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

//export to router
module.exports = router