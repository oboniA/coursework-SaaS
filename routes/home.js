// import libraries
const express = require('express')
const router = express.Router()
const User = require('../models/User') // User Model
const verifyToken = require('../verifyAccessToken') // for authentication

// callback
router.get('/', verifyToken, (req, res) => {
    try{ 
        res.send('Access Token Accepted'
                +'\n'+
                'Welcome to Piazza.')
    }catch(err){
        res.status(400).send({message:err})
    }
})


//export to router
module.exports = router






