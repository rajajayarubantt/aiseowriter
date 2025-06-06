const express = require("express");
const Routes = express.Router()

const IntegrationController = require("../../../controllers/integration/integration");
const integrationController = new IntegrationController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, integrationController.get_connections)
Routes.get('/auth', verifytoken.verify, integrationController.auth_integration)

Routes.get('/linkedin-auth-callback', integrationController.linkedin_auth_callback)

Routes.delete('/', verifytoken.verify, integrationController.delete_connection)

module.exports = Routes