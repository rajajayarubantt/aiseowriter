const express = require("express");
const Routes = express.Router()

const PlatformController = require("../../../controllers/platforms/platform");
const platformController = new PlatformController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, platformController.post_platform)

module.exports = Routes