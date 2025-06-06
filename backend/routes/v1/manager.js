const express = require("express");
const Routes = express.Router()

const auth = require("./auth/auth");
const articles = require("./articles/articles");
const campaigns = require("./campaigns/campaigns");
const schedules = require("./schedules/schedules");
const integration = require("./integration/integration");
const brands = require("./brands/brands");
const users = require("./users/users");

const earlybirds = require("./earlybirds/earlybirds");
const publicblogs = require("./publicblogs/publicblogs");

Routes.use('/auth', auth)
Routes.use('/articles', articles)
Routes.use('/campaigns', campaigns)
Routes.use('/schedules', schedules)
Routes.use('/integration', integration)
Routes.use('/brands', brands)
Routes.use('/users', users)
Routes.use('/earlybirds', earlybirds)
Routes.use('/blogs', publicblogs)

module.exports = Routes
