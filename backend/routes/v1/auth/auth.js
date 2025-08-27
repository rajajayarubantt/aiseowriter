const express = require("express");
const Routes = express.Router()

const AuthController = require("../../../controllers/auth/auth");
const authController = new AuthController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/register', authController.register)
Routes.post('/internalSubscribe', authController.internalSubscribe)
Routes.get('/verifylogin', authController.verifylogin)
Routes.get('/verifygoogleauth', authController.verifyGoogleAuth)
Routes.post('/onboard', verifytoken.verify, authController.onboard)

module.exports = Routes