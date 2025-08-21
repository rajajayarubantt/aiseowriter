require('dotenv')

const { ObjectId } = require('mongodb');

const config = require('config')
const PAYMENT_GATEWAY_BASE_URL = config.get('PAYMENT_GATEWAY_BASE_URL')
const PAYMENT_GATEWAY_API_KEY = config.get('PAYMENT_GATEWAY_API_KEY')

const mysqlTables = config.get('mysqlTables')

const Utils = require('../../helpers/utils')
const axios = require('axios')
const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()
const FieldsUpdate = require("../../helpers/FieldsUpdate");
const { runPreparedQuery } = require('../../helpers/mysqlQuery')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()


class Subscriptions {

    async get_subscription_plans(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'get_subscription_plans', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                columns,
                page, limit
            } = req.query

            const get_query = {
                status: '1'
            }

            if (id) get_query['_id'] = new ObjectId(id)

            let options = {
                projection: {}
            }

            if (page && limit) {
                options['page'] = page
                options['limit'] = limit
            }

            if (columns && columns.length && columns != "*") {

                String(columns).split(',')?.forEach(p => {

                    options.projection[p] = 1
                })

            }

            let response = await req.mongoDB.find(mysqlTables.SUBSCRIPTION_PLANS, get_query, options)

            let data = response.items || []


            data = data.map(d => {

                d.id = String(d._id)

                return d
            })


            return responseHandler.successRequest({
                name: 'get_subscription_plans',
                req, res,
                message: "Subscriptions retrived successfully!",
                data: data,
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_subscription_plans', req, res })
        }

    }
    async get_active_subscription(req, res) {
        try {

            const { org_id, user_id, user_name, user_email } = req

            let subscription_query = {
                org_id: org_id,
                status: 1,
                expires_at: {
                    '$gt': new Date().getTime()
                }
            }
            let subscription_response = await req.mongoDB.findOne(mysqlTables.SUBSCRIPTIONS, subscription_query)

            if (!subscription_response) responseHandler.failedRequest({
                name: 'get_active_subscription',
                req, res,
                message: "No active subscription!",
            })

            let plan_details = subscription_response.plan_details || {}

            const subscription_data = {
                id: String(subscription_response._id),
                active: subscription_response.payment_status == 'active',
                created_at: subscription_response.created_at,
                expires_at: subscription_response.expires_at,
                total_credits: subscription_response.total_credits,
                used_credits: subscription_response.used_credits,
                balance_credits: subscription_response.balance_credits,

                plan_id: String(plan_details._id),
                active_plan_name: plan_details.name,
                is_freeplan: plan_details.is_freeplan,
                expiry_duration_days: Utils.getDaysBetweenDates(subscription_response.expires_at, new Date()),

                limitations: {
                    articles: parseInt(plan_details.blog_count),
                    image: parseInt(plan_details.image_count),
                    keywords: parseInt(plan_details.keywords_count),
                    sitemap: parseInt(plan_details.sitemap_count),
                    users: parseInt(plan_details.users_count),
                }
            }

            return responseHandler.successRequest({
                name: 'get_active_subscription',
                req, res,
                data: subscription_data,
                message: "Active subscription found!",
            })

        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_active_subscription', req, res })
        }
    }

    async subscribe(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'admin_create_subscription', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const {
                subscription_id,
                status,

            } = req.query


            const subscriptionResponse = await axios.get(PAYMENT_GATEWAY_BASE_URL + `/${subscription_id}`, {
                headers: { Authorization: `Bearer ${PAYMENT_GATEWAY_API_KEY}` }
            });

            if (subscriptionResponse.status != 200) return res.redirect("http://localhost:3000/upgrade")

            const subScriptionDetails = subscriptionResponse.data || {}


            const { product_id, payment_frequency_interval, customer } = subScriptionDetails
            const { email } = customer

            const get_user_details = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id, org_id`,
                TABEL: mysqlTables.USERS,
                VALID: {
                    email: email
                }
            })

            let get_user_details_res = await runPreparedQuery(get_user_details.query, get_user_details.value)

            get_user_details_res = get_user_details_res[0]

            if (!get_user_details_res) return res.redirect("http://localhost:3000/upgrade")

            const org_id = get_user_details_res.org_id

            const subscription_data = {
                org_id: org_id,
                paid_by: email,
                subscription_id: subscription_id,
                subscription_details: subScriptionDetails,
                payment_status: status,
                plan_details: {},
                total_credits: 0,
                used_credits: 0,
                balance_credits: 0,
                status: 1,
                expires_at: new Date(subScriptionDetails.expires_at).getTime(),
                created_at: new Date().getTime()
            }

            const subscription_plan_query = {}

            if (payment_frequency_interval == 'Year') {
                subscription_plan_query['yearly_plan_id'] = product_id
            } else {
                subscription_plan_query['monthly_plan_id'] = product_id
            }


            let plan_response = await req.mongoDB.findOne(mysqlTables.SUBSCRIPTION_PLANS, subscription_plan_query)

            if (plan_response) {

                subscription_data['plan_details'] = plan_response
                subscription_data['total_credits'] = parseInt(plan_response.blog_count)
                subscription_data['balance_credits'] = parseInt(plan_response.blog_count)
            }

            let response = await req.mongoDB.insertOne(mysqlTables.SUBSCRIPTIONS, subscription_data)


            return res.redirect("http://localhost:3000")
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'admin_create_subscription', req, res })
        }
    }


}

module.exports = Subscriptions;