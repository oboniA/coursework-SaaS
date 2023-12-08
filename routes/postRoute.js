// import libraries
const express = require('express')
const router = express.Router()
const Post = require('../models/Post') // Post Model
const User = require('../models/User') // User Model
const verifyToken = require('../verifyAccessToken') // for authentication


// Post Create Route
router.post('/', verifyToken, async(req, res)=>{
    console.log(req.body) //prints in console

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
    

    const postTime = new Date()
    const postDuration = req.body.postDuration
    const expirationTime = new Date(postTime.getTime() + postDuration*60000)
    

    //extract from Postman, insert in MongoDB(database)
    const postData = new Post( {
        postOwnerName: authUser.username, // auto update signed-in user name
        postTopic: req.body.postTopic,
        postTitle: req.body.postTitle,
        messageBody: req.body.messageBody,
        postRegestrationTime: postTime.toISOString(),
        postDuration: postDuration,
        postExpirationTime: expirationTime.toISOString()
        }
    )

    // insert to DB
    try{
        const postToSave = await postData.save()
        res.send(postToSave) //callback

        }catch(err){
            res.send({message: 'error saving post', error: err}) }
    
})


//export to router
module.exports = router