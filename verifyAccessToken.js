// CREATED NOW, WILL BE TESTED LATER
// import JWT
const jsonwebtoken = require('jsonwebtoken')


// control function
// 'auth-token' is applied at header key
// generated token applied to header value
function authentecation(req, res, next){
    // extract token from header
    const headerToken = req.header('auth-token') 

    // when no token in header
    if(!headerToken){
        return res.status(401).send({message:'Access denied'})
    }

    // when token present
    try{
        const tokenVerified = jsonwebtoken.verify(headerToken, process.env.SECRET_ACCESS_TOKEN)
        req.user = tokenVerified
        next()  // continue
    }catch(err){
        return res.status(401).send({message:'Invalid token'})
    }
}

// export auth module
module.exports = authentecation


