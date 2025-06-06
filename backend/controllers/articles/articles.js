require('dotenv')

const config = require('config')
const mysqlTables = config.get('mysqlTables')
const { runPreparedQuery, runQuery } = require('../../helpers/mysqlQuery')
const FieldsUpdate = require("../../helpers/FieldsUpdate");

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()


class Articles {


    async get_articles(req, res) {

        try {

            await payloadValidator.Validate({ name: 'get_articles', req, res, payload: req.query })

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

            const DEFAULT_COLUMNS = "id,org_id,title,keywords,brand_id,language,status"
            const COLUMNS = `${columns || DEFAULT_COLUMNS},created_at,created_by_name,updated_at,updated_by_name`

            const get_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: COLUMNS,
                TABEL: mysqlTables.ARTICLES,
                VALID: filter,
                PAGE: parseInt(page),
                LIMIT: parseInt(limit)
            })

            const response = await runPreparedQuery(get_query.query, get_query.value)

            const get_summary_query = `SELECT status, COUNT(*) AS count FROM ${mysqlTables.ARTICLES} GROUP BY status;`
            const summary_response = await runQuery(get_summary_query)

            const summary_data = Object.fromEntries(summary_response.map(({ status, count }) => [status, count]))


            return responseHandler.successRequest({
                name: 'get_articles',
                req, res,
                message: "Articles retrived successfully!",
                data: response,
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
            await payloadValidator.Validate({ name: 'generate_title', req, res, payload: req.body })

            const { org_id, user_id, user_name, user_email } = req
            const {
                keywords,
                cover_image,
                language,
                brand_id,
                description,
            } = req.body

            const query_data = {
                org_id,
                keywords: JSON.stringify(keywords, "[]"),
                cover_image,
                language,
                brand_id,
                description: description || "",

                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }

            const insert_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'INSERT',
                TABEL: mysqlTables.ARTICLES,
                DATA: query_data
            })

            let response = await runPreparedQuery(insert_query.query, insert_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'generate_title',
                req, res,
                message: "Failed to generate article title, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'generate_title',
                req, res,
                message: "Article title generated successfully!",
                data: {
                    id: response.insertId
                }
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'generate_title', req, res })
        }

    }
    async delete_article(req, res) {

        try {
            await payloadValidator.Validate({ name: 'delete_article', req, res, payload: req.body })

            const { org_id, user_id, user_name, user_email } = req
            const { id } = req.body


            const delete_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'DELETE',
                TABEL: mysqlTables.ARTICLES,
                VALID: {
                    id: id,
                    org_id: org_id
                }
            })

            let response = await runPreparedQuery(delete_query.query, delete_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'delete_article',
                req, res,
                message: "Failed to delete aticle, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'delete_article',
                req, res,
                message: "Article delete successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'delete_article', req, res })
        }

    }

}

module.exports = Articles;