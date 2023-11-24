// import libraries 
const express = require('express') 
const router = express.Router() 

// import user Post
const User = require('../models/User')

//import user-registration-validation
//const {signupValidation, signinValidation} = require('../validations/validation')

// import passsword encryption package
//const bcryptjs = require('bcryptjs')

// import JWT package
//const jsonwebtoken = require('jsonwebtoken')


// Registration Validations
router.post('/sign-up', async(req, res)=> {
    console.log(req.body)
})

// Sign-in Validations
router.post('/sign-in', async(req, res)=>{

})


//export to router
module.exports = router
