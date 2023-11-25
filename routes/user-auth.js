// import libraries 
const express = require('express') 
const router = express.Router() 

// import user Post
const User = require('../models/User')

// import user-registration-validation
const {signupValidation, signinValidation} = require('../user-validations/validation')


// user registration endpoint
router.post('/sign-up', async(req, res)=> {
    // validation check for user-input
    const {error} = signupValidation(req.body) 
    // if error in user input
    if(error){
        return res.status(400).send({message: error.details[0].message}) // status code 400 = invalid syntax
    }

    // else IF no error in user input
    // code to insert data 
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password: req.body.password
    })
    // save the data to Database
    // exception-handling
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(500).send({message:'server error'})  // status code 500 = server error
    }




})

// user Sign-in endpoint
router.post('/sign-in', async(req, res)=>{
    console.log(req.body)
})

//export to router
module.exports = router
