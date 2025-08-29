const express = require("express");
const Routes = express.Router()

const AdminController = require("../../../controllers/admin/admin");
const adminController = new AdminController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/auth/register', adminController.register)
Routes.post('/auth/login', adminController.login)

Routes.get('/dashboard', verifytoken.verify, adminController.get_dashboard)

Routes.get('/articles', verifytoken.verify, adminController.get_articles)
Routes.post('/articles/generate-title', verifytoken.verify, adminController.generate_title)
Routes.delete('/articles', verifytoken.verify, adminController.delete_article)


Routes.get('/customers', verifytoken.verify, adminController.get_customers)


Routes.get('/plans', verifytoken.verify, adminController.get_plans)
Routes.post('/plans', verifytoken.verify, adminController.create_plan)
Routes.put('/plans', verifytoken.verify, adminController.update_plan)
Routes.delete('/plans', verifytoken.verify, adminController.delete_plan)

module.exports = Routes