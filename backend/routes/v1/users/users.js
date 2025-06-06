const express = require("express");
const Routes = express.Router()

const UsersController = require("../../../controllers/users/users");
const usersController = new UsersController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, usersController.get_users)
Routes.post('/', verifytoken.verify, usersController.create_user)
Routes.put('/', verifytoken.verify, usersController.update_user)
Routes.delete('/', verifytoken.verify, usersController.delete_user)

module.exports = Routes