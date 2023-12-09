// import libraries
const express = require('express')
const router = express.Router()
const Post = require('../models/Post') // Post Model
const User = require('../models/User') // User Model
const verifyToken = require('../verifyAccessToken') // for authentication


// Post LIKE Route
router.post('/:postId/like', verifyToken, async (req, res) => {
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

        // user can't like their own post
        if (postValid.postOwnerName === authUser.username) {
            return res.status(400).send({ message: "You are not allowed to like your own post!" })
        }

        // post already liked
        if (postValid.likedBy.includes(userid)) {
            return res.status(400).send({ message: "Post already liked" })
        }
        // in-case already disliked, remove the dislike
        if (postValid.dislikedBy.includes(userid)) {
            postValid.dislikedBy.pull(userid) // deletes the dislike
            postValid.dislikes -= 1
        }
        // then add like
        postValid.likedBy.push(userid)
        postValid.likes += 1

        // save like in database
        await postValid.save()

        const givePost = {
            loggedInUser: authUser.username,
            likedPost: postValid
            
        }
        return res.status(200).send(givePost)

    } catch(err) {
        console.error('Error in likepost route:', err); // Log the error for debugging purposes
        return res.status(500).send({ message: 'Error', error: err.message }) // Send more specific error details
    }
})


// Post Disliking Route
router.post('/:postId/dislike', verifyToken, async (req, res) => {
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

        // user can't dislike their own post
        if (postValid.postOwnerName === authUser.username) {
            return res.status(400).send({ message: "You are not allowed to dislike your own post!" })
        }
        
        // post already disliked
        if (postValid.dislikedBy.includes(userid)) {
            return res.status(400).send({ message: "Post already disliked" })
        }
        // in-case already liked, remove the like
        if (postValid.likedBy.includes(userid)) {
            postValid.likedBy.pull(userid) // deletes the like
            postValid.likes -= 1
        }
        // then add dislike
        postValid.dislikedBy.push(userid+authUser.us)
        postValid.dislikes += 1

        // save like in database
        await postValid.save()

        const givePost = {
            loggedInUser: authUser.username,
            dislikedPost: postValid
            
        }
        return res.status(200).send(givePost)

    } catch(err) {
        console.error('Error in dislikepost route:', err) // Log the error for debugging purposes
        return res.status(500).send({ message: 'Error', error: err.message }) // Send more specific error details
    }
})


// Comment making route
router.post('/:postId/comment', verifyToken, async (req, res) => {
    try {
        const userid = req.user._id  // extract sign-in user ID
        const comment = req.body.comment
        const commentDate = new Date()

        // when unauthorized access
        if (!userid) {
            return res.status(401).send({message: 'Unauthorized'})
        }
        const authUser = await User.findById(userid) // extract user detail from user ID
        // when user does not exist
        if (!authUser) {
            return res.status(404).send({message: 'User not found'})
        } 

        const postValid = await Post.findById(req.params.postId)  // valid post
        // non-existant post
        if (!postValid) {
            return res.status(400).send({ message: "Post not found" })
        }

       //IF EXPIRED
        if (postValid.status === 'Expired') {
            return res.status(400).send({ message: "Action can not be executed: post is already Expired." })
        }

        const addComment = {
            commenter: authUser.username,
            comment: req.body.comment,
            commentDate: commentDate
        }
        postValid.comments.push(addComment)
        await postValid.save()
        return res.status(200).send(postValid)

    } catch(err) {
        console.error('Error in comment route:', err); // Log the error for debugging purposes
        return res.status(500).send({ message: 'Error', error: err.message }); // Send more specific error details
    }
})


//export to router
module.exports = router
