const express = require("express");
const Routes = express.Router()

const PublicBlogsController = require("../../../controllers/publicblogs/publicblogs");
const publicBlogsController = new PublicBlogsController()

Routes.get('/', publicBlogsController.get_public_blogs_lists)

module.exports = Routes