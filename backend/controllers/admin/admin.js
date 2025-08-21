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
            return responseHandler.serverError({ name: 'get_articles', req, res })
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

}

module.exports = Admin;