const User = require('../models/user')
const bcrypt = require('bcrypt')
const user = require('../models/user')
const jwt = require('jsonwebtoken')

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save().then((result) => {
            res.status(201).json({
                message: 'User is created!!',
                result: result

            })

        }).catch((err) => {
            res.status(500).json({
                message: 'Invalid Credentials!!'
            })
        })

    })


}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then((user) => {
        console.log(user)
        if (!user) {
            return res.status(402).json({
                message: 'Auth Failed!!'
            })
        }
        fetchedUser = user
        return bcrypt.compare(req.body.password, user.password)
    }).then((result) => {
        console.log(result)

        if (!result) {
            return res.status(500).json({
                message: 'Auth Failed!!'
            })
        }
        const token = jwt.sign({
            email: fetchedUser.email, userId: fetchedUser._id
        },
            process.env.JWT_Key_secret,
            { expiresIn: '1h' }
        )
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    }).catch(() => {
        return res.status(500).json({
            message: 'Invalid Credentials!!'
        })
    })

}