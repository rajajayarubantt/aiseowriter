const express = require("express");
const Routes = express.Router()
const config = require('config')

const PublicBlogsController = require("../../../controllers/publicblogs/publicblogs");
const publicBlogsController = new PublicBlogsController()

// create a middleware function to verify static X-SECRET KEY for all routes
const verifySecretKey = (req, res, next) => {
    const secretKey = req.headers['x-secret']

    if (secretKey === config.get('X_SECRET_KEY')) {
        next()
    } else {
        res.status(403).json({ error: 'Forbidden' })
    }
}

Routes.get('/', publicBlogsController.get_public_blogs_lists)
Routes.post('/', verifySecretKey, publicBlogsController.post)

module.exports = Routes