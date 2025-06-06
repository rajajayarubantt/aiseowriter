
const jwt = require("jsonwebtoken")

const config = require('config')
const authConfig = config.get('authConfig')

class Token {
    async verify(req, res, next) {

        let header = req.headers['x-access-token'];
        if (!header) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed, Please try to Re-Login!'
            })
        }
        else {
            try {
                let response = await new Promise((resolve, reject) => {
                    return jwt.verify(header, authConfig.AUTH_SECRET, function (err, token) {
                        if (err) reject(err)
                        resolve(token)
                    })
                })

                let { id, org_id, name, email, role_type } = await response


                req.user_id = id
                req.org_id = org_id
                req.user_name = name
                req.user_email = email
                req.role_type = role_type

                next()

            } catch (error) {

                res.status(400).json({
                    success: false,
                    message: "Session expired, Please try to Re-Login!",
                })
            }
        }
    }

}

module.exports = Token