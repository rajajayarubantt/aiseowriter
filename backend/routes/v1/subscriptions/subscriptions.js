const express = require("express");
const Routes = express.Router()

const SubscriptionsController = require("../../../controllers/subscriptions/subscriptions");
const subscriptionsController = new SubscriptionsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, subscriptionsController.get_active_subscription)
Routes.get('/plans', verifytoken.verify, subscriptionsController.get_subscription_plans)
Routes.get('/subscribe', subscriptionsController.subscribe)

module.exports = Routes