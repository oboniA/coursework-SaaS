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
        const userId = req.user._id  // extract sign-in user ID
        // when unauthorized access
        if (!userId) {
            return res.status(401).send({message: 'Unauthorized'})
        }
        
        const authUser = await User.findById(userId) // extract user detail from user ID
        // when user does not exist
        if (!authUser) {
            return res.status(404).send({message: 'User not found'})
        }
        
        const getPosts = await Post.find(req.query).sort({ postRegestrationTime: -1})  // latest post first
        console.log(req.query)  // filters according to query

        const browse_data = {
            loggedInUser: authUser.username,
            totalPosts: getPosts.length,
            posts: getPosts
            
        }

        return res.status(200).send(browse_data)  // reads all posts

    } catch (err) {
        return res.status(500).send({ message: 'Error fetching posts', error: err })
    }
})

// READ a specific post
router.get('/:postId', verifyToken, async(req,res)=> {
    try{
        const userId = req.user._id  // extract sign-in user ID
        // when unauthorized access
        if (!userId) {
            return res.status(401).send({message: 'Unauthorized'})
        }

        const authUser = await User.findById(userId) // extract user detail from user ID
        // when user does not exist
        if (!authUser) {
            return res.status(404).send({message: 'User not found'})
        }

        const getPostById = await Post.findById(req.params.postId)  // fetches post by its ID
        // post does not exist
        if (!getPostById) {
            return res.status(404).send({ message: 'Post Not Found'})
        }

        // EXPLAIN THIS IS NEW BIT
        const timeNow = new Date() // current time

        /*checks if expiration time exists in the post
        and if current time is greater that expired time
        if both true, then post is expired */ 
        if(getPostById.postExpirationTime && timeNow > getPostById.postExpirationTime) 
            {
                getPostById.status = 'Expired'
                await getPostById.save()  // saves in database
            }
        
        /*checks if expiration time exists in the post
        and if current time is less that expired time
        if both true, then post is still active */
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

        const givePost = {
            loggedInUser: authUser.username,
            currentPost: postInfo
            
        }
        res.send(givePost) // displays post with info
    }catch(err){
        res.send({message:err})
    }
})


// Edit a Specific post
router.patch('/:postId', verifyToken, async (req, res) => {
    try {
        const userid = req.user._id  // extract sign-in user ID
        // when unauthorized access
        if (!userid) {
            return res.status(401).send({message: 'Unauthorized'})
        }

        const authUser = await User.findById(userid) // extract user detail from user ID
        // when user does not exist
        if (!authUser) {
            return res.status(404).send({message: 'User not found'})
        } 

        const postValid = await Post.findById(req.params.postId)  //check if post exists in DB
        // non-existant post
        if (!postValid) {
            return res.status(400).send({ message: "Post not found" })
        }
        
        //IF EXPIRED
        if (postValid.status === 'Expired') {
            return res.status(400).send({ message: "Action can not be executed: post is already Expired." })
        }

        if (authUser.username != postValid.postOwnerName) {
            return res.status(400).send({ message: "Action can not be executed: This post do not belong to you!" })
        }        
        else {
            //This will update the expiration time if duration changed
            const postTime = postValid.postRegestrationTime
            const editpostDuration = req.body.postDuration
            const newexpirationTime = new Date(postTime.getTime() + editpostDuration*60000)

            try {
                postValid.postOwnerName = authUser.username
                postValid.postTitle = req.body.postTitle
                postValid.messageBody = req.body.messageBody
                postValid.postDuration = editpostDuration
                postValid.postExpirationTime = newexpirationTime

                const postUpdate = await postValid.save()
                res.send(postUpdate) 

            } catch (err) {
                res.status(500).send({ message: 'Error Updating', error: err })
            }
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error', error: err.message }) // Send more specific error details
    }
})


// DELETE a Specific post
router.delete('/:postId', verifyToken, async (req, res) => {

    const userid = req.user._id 
    if (!userid) {
        return res.status(401).send({message: 'Unauthorized'})
    }

    const authUser = await User.findById(userid)
    if (!authUser) {
        return res.status(404).send({message: 'User not found'})
    } 

    const postValid = await Post.findById(req.params.postId)  //check if post exists in DB
    // non-existant post
    if (!postValid) {
        return res.status(400).send({ message: "Post not found" })
    }

    if (authUser.username !== postValid.postOwnerName) {
        return res.status(400).send({ message: "Action can not be executed: This post do not belong to you!" })
    } else {
        try {
            // findOneAndDelete() mongoose function
            const postDelete = await Post.findOneAndDelete({
                _id: req.params.postId  // deletes post by ID
            }) 
            res.send({ message:"Post Deleted!", data: postDelete})
        } catch (err) {
            res.status(500).send({ message:"Deletion Unsuccessful!", error: err })
        }
    } 
        
})


//export to router
module.exports = router 