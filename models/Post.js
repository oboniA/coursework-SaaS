// import mongoose
const mongoose = require('mongoose')
const { post } = require('../routes/user-auth')

// Comment schema
const commentSchema = mongoose.Schema( {
    commenter: String,
    comment: String,
    commentDate: { 
        type: Date, 
        default: Date.now()
    }
})
 
// Post Schema
const postSchema = mongoose.Schema({
    postOwnerName: {
        type: String, 
    },
    postTopic: {
        type: String ,
        enum: {
            values: ["Tech", "Health", "Sports", "Politics"], // only topics allowed
            message: '{Value} is not supported'
        }
    },
    postTitle: {
        type: String,  
    },
    messageBody: {
        type: String,
    },
    postRegestrationTime: {
        type: Date,
        default: Date.now  // current date and time
    },
    postDuration: {
        type: Number,
        required: true
    },
    postExpirationTime: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from current time
    },
    status: {
        type: String,
        default: 'Live' 
    },
     // likes count
     likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    // dislikes count
    dislikes: {
        type: Number,
        default: 0
    },
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    // comments array
    comments: [ commentSchema ]
})


//export schema to database collection
module.exports = mongoose.model('posts', postSchema)