// import libraries 
const express = require('express') 
const router = express.Router() 

// import user Post
const User = require('../models/User')

// import user-registration-validation
const {signupValidation, signinValidation} = require('../user-validations/validation')


// user registration endpoint
router.post('/sign-up', async(req, res)=> {
    console.log(req.body)
})

// user Sign-in endpoint
router.post('/sign-in', async(req, res)=>{
    console.log(req.body)
})

//export to router
module.exports = router
