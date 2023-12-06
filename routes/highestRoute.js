// import libraries
const express = require('express')
const router = express.Router()
const Post = require('../models/Post') // Post Model
const User = require('../models/User') // User Model
const verifyToken = require('../verifyAccessToken') // for authentication
const { status } = require('express/lib/response')


// Post with maximum likes AND dislikes
// with filtered topic
// filtered status
router.get("/maxint/:postTopic/:status", verifyToken, async (req, res) => {
    const posttopic = req.params.postTopic
    const status = req.params.status

    try {
        const maxpost = await Post.aggregate([
            
            { $match: {
                // return post match with :filter
                 postTopic: posttopic,
                 status: status 
                 }
            },
            {
                $project: {  
                    // generate these values
                    _id: true,
                    postOwnerName: true,
                    postTopic: true,
                    postTitle: true,
                    messageBody: true,
                    postRegestrationTime: true,
                    status: true,
                    likes: true,
                    dislikes: true

                }
            },
            {
                $sort: {likes: -1, dislikes: -1}  // descending order

            },
            {
                $limit: 1  // return top value from sorted array
            }
        ])
        res.send(maxpost)

    } catch (err) {
        res.status(500).send({ message: 'Error fetching posts', error: err })
    }
})


//export to router
module.exports = router

