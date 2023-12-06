// import joi
const joi = require('joi')


// user registration validation
const signupValidation = (data) => {
    // define schema
    const schemaValidation = joi.object({
        username: joi.string().required().min(3).max(256),
        email: joi.string().required().email().min(6).max(256),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data) // validate data in schema
}


// user sign-in validation
const signinValidation = (data) => {
    // define schema
    const schemaValidation = joi.object({
        email:joi.string().required().email().min(6).max(256),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)  // validate data in schema
}


// export validation
module.exports = {signupValidation, signinValidation}