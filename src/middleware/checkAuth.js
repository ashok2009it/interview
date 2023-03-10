const jwt = require('jsonwebtoken')
const Helper = require('../utils/helper')
const helper = new Helper()

const checkAuth = (req, res, next) => {
    const token = helper.extractToken(req)

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err || !token) {
            return res.status(401).json({
                success: false,
                msg: 'No/Invalid Token, Auth is denied',
            })
        }
        if (user.deletedAt) {
            return res.status(401).json({
                success: false,
                user,
                msg: 'User is deleted/banned',
            })
        }
        if (!user.active) {
            return res.status(401).json({
                success: false,
                msg: 'User is not active',
            })
        }
        if (!user.is_email_verified) {
            // return res.status(401).json({
            //     success: false,
            //     user,
            //     msg: 'User Email not verified',
            // })
        }
        req.user = user
        next()
    })
}

module.exports = checkAuth
