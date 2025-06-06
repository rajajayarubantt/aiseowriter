require('dotenv')

const config = require('config')
const mysqlTables = config.get('mysqlTables')
const { runPreparedQuery } = require('../../helpers/mysqlQuery')
const FieldsUpdate = require("../../helpers/FieldsUpdate");

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()


class Schedules {

    async get_schedules(req, res) {

        try {

            await payloadValidator.Validate({ name: 'get_schedules', req, res, payload: req.query })

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                columns,
                search,
                brand,
                industry,
                category,
                language,
                start_date,
                end_date,
                time,
                media,
            } = req.query

            let filter = {
                org_id
            }

            if (id) filter.id = id
            if (brand) filter.brand_id = brand
            if (industry) filter.industry = industry
            if (category) filter.category = category
            if (language) filter.language = language

            const DEFAULT_COLUMNS = "id,name,brand_id,org_id,start_date,end_date, JSON_LENGTH(posts) AS postcount,status"
            const COLUMNS = `${columns || DEFAULT_COLUMNS},created_at,created_by_name,updated_at,updated_by_name`

            const get_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: COLUMNS,
                TABEL: mysqlTables.SCHEDULES,
                VALID: filter
            })

            let response = await runPreparedQuery(get_query.query, get_query.value)

            return responseHandler.successRequest({
                name: 'get_schedules',
                req, res,
                message: "Schedules retrived successfully!",
                data: response
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_schedules', req, res })
        }

    }
    async create_schedules(req, res) {

        try {
            await payloadValidator.Validate({ name: 'create_schedules', req, res, payload: req.body })

            const { org_id, user_id, user_name, user_email } = req
            const {
                name,
                brand_id,
                description,
                industry,
                category,
                language,
                start_date,
                end_date,
                posts,
                days,
                keywords,
                tone,
                media,
                call_to_action,
            } = req.body

            const query_data = {
                org_id,
                name,
                brand_id,
                description,
                industry,
                category,
                language,
                start_date,
                end_date,
                posts: JSON.stringify(posts || "[]"),
                days,
                keywords,
                tone,
                media,
                call_to_action,

                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }

            const insert_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'INSERT',
                TABEL: mysqlTables.SCHEDULES,
                DATA: query_data
            })

            let response = await runPreparedQuery(insert_query.query, insert_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'create_schedules',
                req, res,
                message: "Failed to create schedule, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'create_schedules',
                req, res,
                message: "Schedule created successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'create_schedules', req, res })
        }

    }

    async update_schedules(req, res) {

        try {
            await payloadValidator.Validate({ name: 'update_schedules', req, res, payload: req.body })

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                name,
                brand_id,
                description,
                industry,
                category,
                language,
                start_date,
                end_date,
                posts,
                days,
                keywords,
                tone,
                media,
                call_to_action,

                status
            } = req.body

            const query_data = {
                name,
                brand_id,
                description,
                industry,
                category,
                language,
                start_date,
                end_date,
                posts: JSON.stringify(posts || "[]"),
                days,
                keywords,
                tone,
                media,
                call_to_action,

                status: status || 0,

                updated_by_id: user_id,
                updated_by_name: user_name || user_email,
            }

            const update_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'UPDATE',
                TABEL: mysqlTables.SCHEDULES,
                DATA: query_data,
                VALID: {
                    id: id,
                    org_id: org_id
                }
            })

            let response = await runPreparedQuery(update_query.query, update_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'update_schedules',
                req, res,
                message: "Failed to update schedule, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'update_schedules',
                req, res,
                message: "Schedule update successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'update_schedules', req, res })
        }

    }
    async delete_schedules(req, res) {

        try {
            await payloadValidator.Validate({ name: 'delete_schedules', req, res, payload: req.body })

            const { org_id, user_id, user_name, user_email } = req
            const { id } = req.body


            const delete_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'DELETE',
                TABEL: mysqlTables.SCHEDULES,
                VALID: {
                    id: id,
                    org_id: org_id
                }
            })

            let response = await runPreparedQuery(delete_query.query, delete_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'delete_schedules',
                req, res,
                message: "Failed to delete schedule, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'delete_schedules',
                req, res,
                message: "Schedule delete successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'delete_schedules', req, res })
        }

    }

}

module.exports = Schedules;