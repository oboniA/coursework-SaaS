// import joi
const joi = require('joi')


// user registration validation
const signupValidation = (data) => {
    // define validation schema
    const schemaValidation = joi.object({
        // define each unique identifier
        username: joi.string().required().min(3).max(256),
        email: joi.string().required().email().min(6).max(256),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}


// user sign-in validation
const signinValidation = (data) => {
    const schemaValidation = joi.object({
        // define each unique identifier
        email:joi.string().required().email().min(6).max(256),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}


// export validation
module.exports = {signupValidation, signinValidation}