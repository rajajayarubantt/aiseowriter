const express = require("express");
const Routes = express.Router()

const EarlybirdsController = require("../../../controllers/earlybirds/earlybirds");
const earlybirdsController = new EarlybirdsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, earlybirdsController.get_earlybirds_lists)
Routes.post('/', earlybirdsController.create_earlybirds_list)
Routes.put('/', verifytoken.verify, earlybirdsController.update_earlybirds_list)

module.exports = Routes