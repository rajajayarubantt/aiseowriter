const express = require("express");
const Routes = express.Router()

const admin = require("./admin/admin");
const auth = require("./auth/auth");
const articles = require("./articles/articles");
const campaigns = require("./campaigns/campaigns");
const schedules = require("./schedules/schedules");
const integration = require("./integration/integration");
const brands = require("./brands/brands");
const sitemap = require("./sitemap/sitemap");
const platform = require("./platform/platform");
const users = require("./users/users");
const subscriptions = require("./subscriptions/subscriptions");

const earlybirds = require("./earlybirds/earlybirds");
const publicblogs = require("./publicblogs/publicblogs");

Routes.use('/admin', admin)
Routes.use('/auth', auth)
Routes.use('/articles', articles)
Routes.use('/campaigns', campaigns)
Routes.use('/schedules', schedules)
Routes.use('/integration', integration)
Routes.use('/brands', brands)
Routes.use('/sitemap', sitemap)
Routes.use('/users', users)
Routes.use('/earlybirds', earlybirds)
Routes.use('/blogs', publicblogs)
Routes.use('/platform', platform)

Routes.use('/subscriptions', subscriptions)

module.exports = Routes
