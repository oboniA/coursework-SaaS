// import mongoose
const mongoose = require('mongoose')

// create USER schema
const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now
    }
})

//export schema to database collection
module.exports = mongoose.model('users', userSchema)