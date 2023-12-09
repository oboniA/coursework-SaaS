// import mongoose
const mongoose = require('mongoose')

// Create USER schema
// Required fields: username, email, password, date joined
// min/max denotes characters
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
    date_joined:{
        type:Date,
        default:Date.now
    }
})


//export schema to database collection
module.exports = mongoose.model('users', userSchema) 




