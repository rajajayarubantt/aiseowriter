const express = require("express");
const Routes = express.Router()

const BrandsController = require("../../../controllers/brands/brands");
const brandsController = new BrandsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, brandsController.get_brands)
Routes.post('/', verifytoken.verify, brandsController.create_brand)
Routes.put('/', verifytoken.verify, brandsController.update_brand)
Routes.delete('/', verifytoken.verify, brandsController.delete_brand)

module.exports = Routes