 // import libraries 
const express = require('express') 
const router = express.Router() 

// import user Post
const User = require('../models/User')

// import user registration and signin validations
const {signupValidation, signinValidation} = require('../user-validations/validation')

// import passsword encryption/decryption library
const bcryptjs = require('bcryptjs')

// import JWT library
const jsonwebtoken = require('jsonwebtoken')


// USER REGISTRATION END-POINT
router.post('/sign-up', async(req, res)=> {

    // validation check for user-input
    const {error} = signupValidation(req.body) 
    // error in user input
    if(error){
        return res.status(400).send({message: error.details[0].message}) 
    }

    // validation check for existing user
    const userExists = await User.findOne({email:req.body.email}) 
    // existing user
    if(userExists){
        return res.status(400).send({message: 'User Aready Exists'})
    }

    // encrypt password
    const salt = await bcryptjs.genSalt(5)  // hash password with random no.
    const hashPass = await bcryptjs.hash(req.body.password,salt)

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

    // validation check for user-input
    const {error} = signinValidation(req.body) 
    // error in user input
    if(error){
        return res.status(400).send({message: error.details[0].message}) 
    }

    // validation check for existing user-account 
    const user = await User.findOne({email:req.body.email}) 
    // non-existant user-account
    if(!user){
        return res.status(400).send({message: 'Account Does Not Exist. Try With A Different Account.'})
    }
    
    // decrypt password to compare
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    // wrong password
    if(!passwordValidation){
        return res.status(400).send({message: 'Password Is Incorrect'})
    }

    /* when correct password,
       will generate access token key 
       signed unique token for every user id  
    */
    const accessTokenKey = jsonwebtoken.sign({_id:user._id}, process.env.SECRET_ACCESS_TOKEN)  // token in .env
    // token sent in response body and header
    res.header('access-token', accessTokenKey).send({'access-token': accessTokenKey})
})

//export to router
module.exports = router
