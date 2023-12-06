// import libraries
const express = require('express')
const router = express.Router()
const Post = require('../models/Post') // Post Model
const User = require('../models/User') // User Model
const verifyToken = require('../verifyAccessToken') // for authentication
const { get } = require('express/lib/response')


// Browse all posts
// filter posts by topic
router.get('/', verifyToken, async (req, res) => {
    try {
        const getPosts = await Post.find(req.query).sort({ postRegestrationTime: -1})  // latest post first
        console.log(req.query)  // filters according to query

        return res.status(200).send({message: 'NEWS FEED', data: getPosts })  // reads all posts

    } catch (err) {
        return res.status(500).send({ message: 'Error fetching posts', error: err })
    }
})

// READ a specific post
router.get('/:postId', verifyToken, async(req,res)=> {
    try{
        const getPostById = await Post.findById(req.params.postId)  // fetches post by its ID
        // post does not exist
        if (!getPostById) {
            return res.status(404).send({ message: 'Post Not Found'})
        }

        // EXPLAIN THIS IS NEW BIT
        const timeNow = new Date() // current time

        if(getPostById.postExpirationTime && timeNow > getPostById.postExpirationTime) 
            {
                getPostById.status = 'Expired'
                await getPostById.save()  // saves in database
            }
        
        if(getPostById.postExpirationTime && timeNow < getPostById.postExpirationTime) 
            {
                getPostById.status = 'Live'
                await getPostById.save()  // saves in database
            }

        
        const postInfo = {
            postOwnerName: getPostById.postOwnerName,
            postTopic: getPostById.postTopic,
            postTitle: getPostById.postTitle,
            messageBody: getPostById.messageBody,
            postRegestrationTime: getPostById.postRegestrationTime,
            postExpirationTime: getPostById.postExpirationTime,
            status: getPostById.status,
            likes: getPostById.likes,
            likedBy: getPostById.likedBy,
            dislikes: getPostById.dislikes,
            dislikedBy: getPostById.dislikedBy,
            comments: getPostById.comments

            // add time left for post expiration
        }
        res.send(postInfo) // displays post with info
    }catch(err){
        res.send({message:err})
    }
})


//export to router
module.exports = router