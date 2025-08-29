require('dotenv')

const { ObjectId } = require('mongodb');
const config = require('config')
const mysqlTables = config.get('mysqlTables')
const Utils = require("../../helpers/utils");
const AuthHelper = require('../../helpers/auth')
const { runPreparedQuery } = require('../../helpers/mysqlQuery')
const requestIp = require('request-ip');
const FieldsUpdate = require("../../helpers/FieldsUpdate");

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class Admin {

    async register(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_register', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { email, password } = req.body


            const check_user_exist = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id`,
                TABEL: mysqlTables.ADMIN_USERS,
                VALID: {
                    email: email
                }
            })

            let check_user_exist_res = await runPreparedQuery(check_user_exist.query, check_user_exist.value)

            if (Array.isArray(check_user_exist_res) && check_user_exist_res.length && check_user_exist_res[0].id) {
                return responseHandler.serverError({
                    name: 'admin_register',
                    message: 'Email or Phone already exist, Please try to login!',
                    req,
                    res
                })
            }

            let hashed_password = await AuthHelper.HashPassword(password)

            let register_data = {
                email,
                password: hashed_password,
                created_by_id: email,
                created_by_name: email,
            }

            const register_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'INSERT',
                TABEL: mysqlTables.ADMIN_USERS,
                DATA: register_data
            })

            let response = await runPreparedQuery(register_query.query, register_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'admin_register',
                req, res,
                message: "Failed to register, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'admin_register',
                req, res,
                message: "Registeration Successful!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_register', req, res })
        }

    }
    async login(req, res) {

        try {

            console.log(req.body, 'req.body');

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_register', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { email, password } = req.body


            const check_user_exist = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id, email, password`,
                TABEL: mysqlTables.ADMIN_USERS,
                VALID: {
                    email: email
                }
            })

            let check_user_exist_res = await runPreparedQuery(check_user_exist.query, check_user_exist.value)

            if (!check_user_exist_res.length) {

                return responseHandler.serverError({
                    name: 'admin_login',
                    message: "User not registered, Please try to register!",
                    req,
                    res
                })
            }

            let exist_user = check_user_exist_res[0]

            let comparePassword = await AuthHelper.ComparePassword(password, exist_user.password)

            if (!comparePassword) {
                return responseHandler.serverError({
                    name: 'admin_login',
                    message: "Incorrect password!, Please try again.",
                    req, res
                })
            }

            let jwt_token = await AuthHelper.GenerateJWTToken({
                id: exist_user.id,
                email: exist_user.email,
                role_type: 'admin'
            })

            if (!jwt_token) return responseHandler.serverError({ name: 'admin_login', req, res })

            res.cookie("access_token", jwt_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 24 * 15 * 60 * 1000) })


            return responseHandler.successRequest({
                name: 'admin_login',
                req, res,
                data: {
                    auth_token: jwt_token,
                    userdetails: exist_user,
                },
                message: "User logged in successfully",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_login', req, res })
        }

    }

    // Articles
    async get_articles(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_get_articles', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            let { id, slug, search, category, page, limit, projection } = req.query

            const get_query = {}

            if (id) get_query['_id'] = id
            if (slug) get_query['url'] = slug
            if (category) get_query['category'] = { $regex: category, $options: 'i' }

            let options = {
                projection: {}
            }

            if (page && limit) {
                options['page'] = page
                options['limit'] = limit
            }

            if (projection && projection.length) {

                String(projection).split(',')?.forEach(p => {

                    options.projection[p] = 1
                })

            }

            let response = await req.mongoDB.find(mysqlTables.PUBLIC_BLOGS, get_query, options)
            let summary_response = await req.mongoDB.aggregate(mysqlTables.PUBLIC_BLOGS, [
                {
                    '$group': {
                        _id: "$status",
                        count: { '$sum': 1 }
                    }
                }
            ])

            const data = response.items?.map(i => {
                i.id = i._id

                return i
            })

            const summary_data = Object.fromEntries(summary_response.map(({ _id, count }) => [_id, count]))

            return responseHandler.successRequest({
                name: 'admin_get_articles',
                req, res,
                message: "Blogs lists retrived successfully!",
                data: data || [],
                summary_data
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_get_articles', req, res })
        }

    }
    async generate_title(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_generate_title', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { user_id, user_name, user_email } = req
            const {
                keywords,
                cover_image,
                language,
                brand_id,
                description,
            } = req.body

            const query_data = {
                keywords,
                cover_image: {
                    ratio: cover_image,
                    url: '',
                    alt: ''
                },
                title: '',
                words: 0,
                meta_description: '',
                language,
                brand_id,
                description: description || "",

                schedule_id: null,
                status: 0,
                titles: [],
                outlines: [],
                content: '',
                author: {
                    name: 'Ai SEO Writer',
                    id: '#',
                    profile_url: ''
                },

                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }


            let response = await req.mongoDB.insertOne(mysqlTables.PUBLIC_BLOGS, query_data)

            console.log(response, 'response');


            if (!response.acknowledged || !response.insertedId) return responseHandler.failedRequest({
                name: 'admin_generate_title',
                req, res,
                message: "Failed to generate article title, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'admin_generate_title',
                req, res,
                message: "Article title generated successfully!",
                data: {
                    id: response.insertedId
                }

            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_generate_title', req, res })
        }

    }
    async delete_article(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_delete_article', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const { id } = req.body


            const delete_query = {
                _id: new ObjectId(id),
            }

            let response = await req.mongoDB.deleteOne(mysqlTables.PUBLIC_BLOGS, delete_query)


            if (!response.acknowledged || !response.deletedCount) return responseHandler.failedRequest({
                name: 'admin_delete_article',
                req, res,
                message: "Failed to delete aticle, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'admin_delete_article',
                req, res,
                message: "Article delete successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_delete_article', req, res })
        }

    }


    // Subscription Plans
    async get_plans(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_get_plans', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            let { id, page, limit, projection } = req.query

            const get_query = {}

            if (id) get_query['_id'] = id

            let options = {
                projection: {}
            }

            if (page && limit) {
                options['page'] = page
                options['limit'] = limit
            }

            if (projection && projection.length) {

                String(projection).split(',')?.forEach(p => {

                    options.projection[p] = 1
                })

            }

            let response = await req.mongoDB.find(mysqlTables.SUBSCRIPTION_PLANS, get_query, options)
            let summary_response = await req.mongoDB.aggregate(mysqlTables.SUBSCRIPTION_PLANS, [
                {
                    '$group': {
                        _id: "$status",
                        count: { '$sum': 1 }
                    }
                }
            ])

            const data = response.items?.map(i => {
                i.id = i._id

                return i
            })

            const summary_data = Object.fromEntries(summary_response.map(({ _id, count }) => [_id, count]))

            return responseHandler.successRequest({
                name: 'admin_get_plans',
                req, res,
                message: "Plans retrived successfully!",
                data: data || [],
                summary_data
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_get_plans', req, res })
        }

    }
    async create_plan(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_create_plans', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { user_id, user_name, user_email } = req
            const {
                name,
                monthly_plan_id,
                yearly_plan_id,
                blog_count,
                image_count,
                keywords_count,
                monthly_price,
                sitemap_count,
                status,
                users_count,
                features,
                recommended,
                is_freeplan,
            } = req.body

            const query_data = {

                name,
                monthly_plan_id,
                yearly_plan_id,
                blog_count: parseInt(blog_count),
                image_count: parseInt(image_count),
                keywords_count: parseInt(keywords_count),
                monthly_price: parseInt(monthly_price),
                sitemap_count: parseInt(sitemap_count),
                status: parseInt(status),
                users_count: parseInt(users_count),
                features,
                recommended,
                is_freeplan,

                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }


            let response = await req.mongoDB.insertOne(mysqlTables.SUBSCRIPTION_PLANS, query_data)


            if (!response.acknowledged || !response.insertedId) return responseHandler.failedRequest({
                name: 'admin_create_plans',
                req, res,
                message: "Failed to create plan, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'admin_create_plans',
                req, res,
                message: "Plan created successfully!",

            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_create_plans', req, res })
        }

    }
    async update_plan(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_update_plans', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { user_id, user_name, user_email } = req
            const {
                id,
                name,
                monthly_plan_id,
                yearly_plan_id,
                blog_count,
                image_count,
                keywords_count,
                monthly_price,
                sitemap_count,
                status,
                users_count,
                features,
                recommended,
                is_freeplan,
            } = req.body

            const query_data = {

                $set: {
                    name,
                    monthly_plan_id,
                    yearly_plan_id,
                    blog_count: parseInt(blog_count),
                    image_count: parseInt(image_count),
                    keywords_count: parseInt(keywords_count),
                    monthly_price: parseInt(monthly_price),
                    sitemap_count: parseInt(sitemap_count),
                    status: parseInt(status),
                    users_count: parseInt(users_count),
                    features,
                    recommended,
                    is_freeplan,

                    updated_at: new Date().getTime(),
                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }
            }


            let response = await req.mongoDB.updateOne(mysqlTables.SUBSCRIPTION_PLANS, { '_id': ObjectId(id) }, query_data)


            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'admin_update_plans',
                req, res,
                message: "Failed to update plan, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'admin_update_plans',
                req, res,
                message: "Plan updated successfully!",

            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_update_plans', req, res })
        }

    }
    async delete_plan(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_delete_plans', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { id } = req.body


            const delete_query = {
                _id: new ObjectId(id),
            }

            let response = await req.mongoDB.deleteOne(mysqlTables.SUBSCRIPTION_PLANS, delete_query)


            if (!response.acknowledged || !response.deletedCount) return responseHandler.failedRequest({
                name: 'admin_delete_plans',
                req, res,
                message: "Failed to delete plan, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'admin_delete_plans',
                req, res,
                message: "Plan delete successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_delete_plans', req, res })
        }

    }


    async get_customers(req, res) {
        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_get_customers', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const {
                id,
                columns,
                search,
                page,
                limit


            } = req.query

            let filter = {
                1: 1
            }

            if (id) filter.id = id

            const get_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: "id, org_id, google_id, name, email, status, role_type, onboarding_status, created_at, updated_at",
                TABEL: mysqlTables.USERS,
                VALID: filter
            })

            let response = await runPreparedQuery(get_query.query, get_query.value)
            response = response || []

            let org_ids = response.map(r => r.org_id)

            if (org_ids.length) {
                let subscription_query = {
                    org_id: {
                        "$in": org_ids
                    },
                    expires_at: {
                        '$gt': new Date().getTime()
                    }
                }
                let subscription_response = await req.mongoDB.find(mysqlTables.SUBSCRIPTIONS, subscription_query)
                subscription_response = subscription_response.items

                if (subscription_response && subscription_response.length) {

                    response = response.map(r => {

                        let subscription = subscription_response.find(s => s.org_id == r.org_id)

                        if (subscription) {

                            r.is_freeplan = subscription.plan_details?.is_freeplan || true
                            r.plan_name = subscription.plan_details?.name || ""
                            r.plan_duration = subscription.subscription_details?.payment_frequency_interval || 'Free'
                            r.subscription_id = subscription.subscription_id
                            r.subscription_status = subscription.payment_status

                            r.subscribed_at = subscription.created_at
                            r.subscription_expires_at = subscription.expires_at
                        }

                        return r
                    })
                }
            }

            return responseHandler.successRequest({
                name: 'admin_get_customers',
                req, res,
                message: "Customers retrived successfully!",
                data: response
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_get_customers', req, res })
        }
    }

    async delete_customer(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_delete_customer', req, res, payload: req.params })
            if (isPayloadInvalid) return isPayloadInvalid

            const { id } = req.params

            let response = await req.mongoDB.deleteOne(mysqlTables.USERS, { id })
            if (!response.acknowledged || !response.deletedCount) return responseHandler.failedRequest({
                name: 'admin_delete_customer',
                req, res,
                message: "Failed to delete customer, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'admin_delete_customer',
                req, res,
                message: "Customer deleted successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_delete_customer', req, res })
        }
    }

    async get_dashboard(req, res) {
        try {

            const kpi_data = {
                total_users: 0,
                total_paid_users: 0,
                total_free_users: 0,

                total_articles: 0,
                total_mrr: 0,
            }

            const subscription_plan_ration = {}
            const keywords_ration = {}
            const integration_ration = {}

            const subscriptions_trend = {}
            const articles_trend = {}

            const get_users = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id, name, email, org_id, created_at`,
                TABEL: mysqlTables.USERS,
                VALID: {
                    role_type: "admin"
                }
            })

            let get_users_res = await runPreparedQuery(get_users.query, get_users.value)
            get_users_res = get_users_res || []


            let get_article_query = {}

            let get_article_options = {
                projection: {
                    org_id: 1,
                    keywords: 1,
                    created_at: 1,
                    brand_id: 1,
                }
            }

            let article_response = await req.mongoDB.find(mysqlTables.MONGO_BLOGS, get_article_query, get_article_options)
            article_response = article_response.items || []

            let get_subscription_query = {
                expires_at: {
                    '$gt': new Date().getTime()
                }
            }
            let get_subscription_options = {
                projection: {
                    subscription_id: 1,
                    created_at: 1,
                    'plan_details.name': 1,
                    'plan_details.is_freeplan': 1,
                    'plan_details.blog_count': 1,
                    'plan_details.image_count': 1,
                    'plan_details.sitemap_count': 1,
                    'plan_details.users_count': 1,
                    'plan_details.monthly_price': 1,
                }
            }

            let subscription_response = await req.mongoDB.find(mysqlTables.SUBSCRIPTIONS, get_subscription_query, get_subscription_options)
            subscription_response = subscription_response.items || []

            console.log(subscription_response);

            const get_integrations = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id, name, status, created_at`,
                TABEL: mysqlTables.BLOG_PLATFORMS,
                VALID: {
                    status: "Connected"
                }
            })

            let get_integrations_res = await runPreparedQuery(get_integrations.query, get_integrations.value)
            get_integrations_res = get_integrations_res || []

            kpi_data.total_users = get_users_res.length
            kpi_data.total_free_users = subscription_response.filter(r => r.plan_details.is_freeplan).length
            kpi_data.total_paid_users = subscription_response.filter(r => r.subscription_id != "free").length

            kpi_data.total_articles = article_response.length
            kpi_data.total_mrr = subscription_response.reduce((acc, curr) => acc + (curr.plan_details.monthly_price || 0), 0)

            subscription_response.forEach(r => {
                const plan_name = r.plan_details.name || 'Free'
                subscription_plan_ration[plan_name] = (subscription_plan_ration[plan_name] || 0) + 1

                // convert this r.created_at to that days start
                const createdAt = new Date(r.created_at)
                createdAt.setHours(0, 0, 0, 0)



                subscriptions_trend[createdAt.getTime()] = subscriptions_trend[createdAt.getTime()] || 0
                subscriptions_trend[createdAt.getTime()] += r.plan_details.monthly_price || 0
            })

            article_response.forEach(r => {
                const keywords = r.keywords || []
                keywords.forEach(keyword => {
                    keywords_ration[String(keyword).trim()] = (keywords_ration[String(keyword).trim()] || 0) + 1
                })

                const createdAt = new Date(r.created_at)
                createdAt.setHours(0, 0, 0, 0)

                articles_trend[createdAt.getTime()] = articles_trend[createdAt.getTime()] || 0
                articles_trend[createdAt.getTime()] += 1
            })

            get_integrations_res.forEach(r => {
                const integration_name = r.name || 'Unknown'
                integration_ration[integration_name] = (integration_ration[integration_name] || 0) + 1

            })

            const users_analytics = get_users_res.map(user => {
                const org_id = user.org_id || 'Unknown'
                const articles_count = article_response.filter(a => a.org_id == org_id).length

                const subscription_plan = subscription_response.find(s => s.org_id == org_id)

                user.subscription_plan = 'Free'
                if (subscription_plan && subscription_plan.plan_details && subscription_plan.plan_details.name) {
                    user.subscription_plan = subscription_plan.plan_details.name || 'Free'
                }

                user.article_count = articles_count

                return user
            }).sort((a, b) => b.article_count - a.article_count)

            return responseHandler.successRequest({
                name: 'admin_get_dashboard',
                req, res,
                message: "Dashboard data retrieved successfully!",
                data: {
                    kpi_data,
                    users_analytics,
                    articles_trend,
                    subscriptions_trend,
                    subscription_plan_ration,
                    keywords_ration,
                    integration_ration
                }
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_get_dashboard', req, res })
        }
    }
}

module.exports = Admin;