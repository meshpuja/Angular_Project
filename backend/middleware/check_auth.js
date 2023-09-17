const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
     const decodedToekn =   jwt.verify(token,process.env.JWT_Key_secret)
     req.userData = {email:decodedToekn.email, userId:decodedToekn.userId}
        next()
    }
    catch (error) {
        res.status(401).json({message:'You are not authenticated!!'})
    }
}