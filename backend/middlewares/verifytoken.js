
const jwt = require("jsonwebtoken")

const config = require('config')
const mysqlTables = config.get('mysqlTables')
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

                let subscription_query = {
                    org_id: org_id,
                    status: 1,
                    expires_at: {
                        '$gt': new Date().getTime()
                    }
                }
                let subscription_options = {
                    projection: {
                        'subscription_details.subscription_period_interval': 1,
                        'subscription_details.product_id': 1,
                    }
                }

                let subscription_response = await req.mongoDB.findOne(mysqlTables.SUBSCRIPTIONS, subscription_query, subscription_options)

                let subscription_data = {
                    subscription_type: subscription_response ? subscription_response.subscription_details.subscription_period_interval : null,
                    product_id: subscription_response ? subscription_response.subscription_details.product_id : null,
                }

                req.subscription_data = subscription_data

                next()

            } catch (error) {
                console.log(error);

                res.status(400).json({
                    success: false,
                    message: "Session expired, Please try to Re-Login!",
                })
            }
        }
    }

    async verify_admin(req, res, next) {

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

                let { id, email, role_type } = await response

                if (role_type != "admin") {
                    return res.status(400).json({
                        success: false,
                        message: "You are not a admin, Please try to Re-Login!",
                    })
                }

                req.user_id = id
                req.user_name = email
                req.user_email = email
                req.role_type = role_type

                return next()

            } catch (error) {

                return res.status(400).json({
                    success: false,
                    message: "Session expired, Please try to Re-Login!",
                })
            }
        }
    }

}

module.exports = Token