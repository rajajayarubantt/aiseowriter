const express = require("express");
const Routes = express.Router()

const SchedulesController = require("../../../controllers/schedules/schedules");
const schedulesController = new SchedulesController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, schedulesController.get_schedules)
Routes.post('/', verifytoken.verify, schedulesController.create_schedules)
Routes.put('/', verifytoken.verify, schedulesController.update_schedules)
Routes.delete('/', verifytoken.verify, schedulesController.delete_schedules)

module.exports = Routes