const express = require("express");
const Routes = express.Router()

const SitemapController = require("../../../controllers/sitemap/sitemap");
const sitemapController = new SitemapController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, sitemapController.get_sitemaps)
Routes.post('/', verifytoken.verify, sitemapController.import_sitemap)
Routes.put('/', verifytoken.verify, sitemapController.update_sitemap)
Routes.put('/refresh', verifytoken.verify, sitemapController.refresh_sitemap)
Routes.put('/activate', verifytoken.verify, sitemapController.activate_sitemap)
Routes.delete('/', verifytoken.verify, sitemapController.delete_sitemap)

module.exports = Routes