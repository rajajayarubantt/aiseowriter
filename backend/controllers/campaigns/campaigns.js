require('dotenv')

const { ObjectId } = require('mongodb');
const config = require('config')
const mysqlTables = config.get('mysqlTables')
const Utils = require('../../helpers/utils')

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()


class Campaigns {

    async get_campaigns(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'get_campaigns', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                columns,
                search,
                page, limit
            } = req.query

            const get_query = {
                org_id: org_id
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

            let response = await req.mongoDB.find(mysqlTables.MONGO_CAMPAIGNS, get_query, options)
            let summary_response = await req.mongoDB.aggregate(mysqlTables.MONGO_CAMPAIGNS, [
                {
                    '$match': {
                        org_id: org_id
                    }
                },
                {
                    '$group': {
                        _id: "$status",
                        count: { '$sum': 1 }
                    }
                }
            ])

            let data = response.items || []

            const get_articles_query = {
                org_id: org_id,
                schedule_id: { "$in": data.map(d => String(d._id)) }
            }

            let get_articles_options = {
                projection: {
                    title: 1,
                    schedule_id: 1,
                    cover_image: 1,
                    url: 1
                }
            }


            let articles_response = await req.mongoDB.find(mysqlTables.MONGO_BLOGS, get_articles_query, get_articles_options)

            articles_response = articles_response.items || []

            articles_response = articles_response.map(a => {

                a.id = a._id

                return a
            })

            data = data.map(d => {

                d.id = String(d._id)
                d.articles = articles_response.filter(a => a.schedule_id == d.id)

                return d
            })


            const summary_data = Object.fromEntries(summary_response.map(({ _id, count }) => [_id, count]))

            return responseHandler.successRequest({
                name: 'get_campaigns',
                req, res,
                message: "Campaigns retrived successfully!",
                data: data,
                summary_data
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_campaigns', req, res })
        }

    }

    async create_campaign(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'create_campaign', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                name,
                description,
                keywords,
                cover_image,
                language,
                brand_id,
                brand_name,
                tone,
                view,
                length,
                schedule_type,
                post_count,
                post_daily,
                inter_links,
                time_zone,
                platforms,
                post_custom_time_zones

            } = req.body

            const insert_data = {
                org_id,
                name,
                keywords,
                cover_image,
                language,
                brand_id,
                brand_name,
                description: description || "",
                tone,
                view,
                length,
                schedule_type,
                post_count,
                post_daily: post_daily ? 1 : 0,
                inter_links: inter_links ? 1 : 0,
                time_zone,
                platforms,
                post_custom_time_zones,
                status: 0,

                created_at: Utils.getCurrentTimeStamp(),
                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }

            let response = await req.mongoDB.insertOne(mysqlTables.MONGO_CAMPAIGNS, insert_data)

            if (!response.acknowledged || !response.insertedId) return responseHandler.failedRequest({
                name: 'create_campaign',
                req, res,
                message: "Failed to create campaign, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'create_campaign',
                req, res,
                message: "Campaign created successfully!",
                data: {
                    id: response.insertedId
                }
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'create_campaign', req, res })
        }

    }


}

module.exports = Campaigns;