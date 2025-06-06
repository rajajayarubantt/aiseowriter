const express = require("express");
const Routes = express.Router()

const CampaignsController = require("../../../controllers/campaigns/campaigns");
const campaignsController = new CampaignsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, campaignsController.get_campaigns)
Routes.post('/', verifytoken.verify, campaignsController.create_campaign)

module.exports = Routes