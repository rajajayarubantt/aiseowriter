require('dotenv')

const config = require('config')
const mysqlTables = config.get('mysqlTables')
const { runPreparedQuery, runQuery } = require('../../helpers/mysqlQuery')
const FieldsUpdate = require("../../helpers/FieldsUpdate");

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()


class Campaigns {


    async get_campaigns(req, res) {

        try {

            await payloadValidator.Validate({ name: 'get_campaigns', req, res, payload: req.query })

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                columns,
                search,
                page, limit
            } = req.query

            let filter = {
                org_id
            }

            if (id) filter.id = id

            const DEFAULT_COLUMNS = "id,org_id,name,description,keywords,brand_id,language,status,post_count,schedule_type,post_daily"
            const COLUMNS = `${columns || DEFAULT_COLUMNS},created_at,created_by_name,updated_at,updated_by_name`

            const get_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: COLUMNS,
                TABEL: mysqlTables.CAMPAIGNS,
                VALID: filter,
                PAGE: parseInt(page),
                LIMIT: parseInt(limit)
            })

            let response = await runPreparedQuery(get_query.query, get_query.value)

            response = response.map(r => {

                r.articles = [
                    {
                        id: 1,
                        cover_image: 'https://images.unsplash.com/photo-1620287341260-a9ecadfe7a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NjcwNzZ8MHwxfHNlYXJjaHwxfHxibG9nZ3xlbnwwfHx8fDE3NDg0ODIyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
                        title: 'How an AI Writer Boosts BlogSEO for Autoblogging Success'
                    }
                ]
                return r
            })

            const get_summary_query = `SELECT status, COUNT(*) AS count FROM ${mysqlTables.CAMPAIGNS} GROUP BY status;`
            const summary_response = await runQuery(get_summary_query)

            const summary_data = Object.fromEntries(summary_response.map(({ status, count }) => [status, count]))


            return responseHandler.successRequest({
                name: 'get_campaigns',
                req, res,
                message: "Campaigns retrived successfully!",
                data: response,
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
            await payloadValidator.Validate({ name: 'create_campaign', req, res, payload: req.body })

            const { org_id, user_id, user_name, user_email } = req
            const {
                name,
                description,
                keywords,
                cover_image,
                language,
                brand_id,
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

            const query_data = {
                org_id,
                name,
                keywords: JSON.stringify(keywords, "[]"),
                cover_image,
                language,
                brand_id,
                description: description || "",
                tone,
                view,
                length,
                schedule_type,
                post_count,
                post_daily: post_daily ? 1 : 0,
                inter_links: inter_links ? 1 : 0,
                time_zone,
                platforms: JSON.stringify(platforms, "[]"),
                post_custom_time_zones: JSON.stringify(post_custom_time_zones, "[]"),


                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }

            const insert_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'INSERT',
                TABEL: mysqlTables.CAMPAIGNS,
                DATA: query_data
            })

            let response = await runPreparedQuery(insert_query.query, insert_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'create_campaign',
                req, res,
                message: "Failed to create campaign, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'create_campaign',
                req, res,
                message: "Campaign created successfully!",
                data: {
                    id: response.insertId
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