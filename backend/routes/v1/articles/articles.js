const express = require("express");
const Routes = express.Router()

const ArticlesController = require("../../../controllers/articles/articles");
const articlesController = new ArticlesController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, articlesController.get_articles)
Routes.delete('/', verifytoken.verify, articlesController.delete_article)
Routes.post('/generate-title', verifytoken.verify, articlesController.generate_title)

module.exports = Routes