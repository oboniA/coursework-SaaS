// import libraries 
const express = require('express') 
const router = express.Router() 

// import user Post
const User = require('../models/User')

// import user registration and signin validations
const {signupValidation, signinValidation} = require('../user-validations/validation')

// import passsword encryption package
const bcryptjs = require('bcryptjs')


// USER REGISTRATION END-POINT
router.post('/sign-up', async(req, res)=> {

    // validation check for user-input
    const {error} = signupValidation(req.body) 
    // if error in user input
    if(error){
        return res.status(400).send({message: error.details[0].message}) 
    }

    // validation check for existing user
    const userExists = await User.findOne({email:req.body.email}) 
    // if user exists
    if(userExists){
        return res.status(400).send({message: 'User Aready Exists'})
    }

    // to add additional layer of security
    // to encrypt password
    const salt = await bcryptjs.genSalt(5)  // hash password with random no.
    const hashPass = await bcryptjs.hash(req.body.password,salt)


    // else
    // insert & save data to Database
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password: hashPass
    })

    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(500).send({message:'server error'})  // status code 500 = server error
    }
})

// USER SIGN-IN END-POINT
router.post('/sign-in', async(req, res)=>{
    console.log(req.body)
})

//export to router
module.exports = router
