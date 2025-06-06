require('dotenv')

const config = require('config')
const Utils = require("../../helpers/utils");
const mysqlTables = config.get('mysqlTables')
const { runPreparedQuery } = require('../../helpers/mysqlQuery')
const FieldsUpdate = require("../../helpers/FieldsUpdate");
const MulterUploader = require('../../helpers/multer');

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()


class Earlybirds {

    async get_earlybirds_lists(req, res) {

        try {

            await payloadValidator.Validate({ name: 'get_earlybirds_lists', req, res, payload: req.query })

            const { user_id, user_name, user_email } = req
            const {
                email

            } = req.query

            let filter = {}

            if (email) filter.email = email

            const get_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `*`,
                TABEL: mysqlTables.EARLYBIRD_LISTS,
                VALID: filter
            })

            let response = await runPreparedQuery(get_query.query, get_query.value)

            return responseHandler.successRequest({
                name: 'get_earlybirds_lists',
                req, res,
                message: "Earlybirds lists retrived successfully!",
                data: response
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_earlybirds_lists', req, res })
        }

    }
    async create_earlybirds_list(req, res) {

        try {

            await payloadValidator.Validate({ name: 'create_earlybirds_list', req, res, payload: req.body })


            const {
                email, params
            } = req.body

            const check_existing_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id`,
                TABEL: mysqlTables.EARLYBIRD_LISTS,
                VALID: {
                    email
                }
            })

            let check_existing_response = await runPreparedQuery(check_existing_query.query, check_existing_query.value)

            if (check_existing_response.length && check_existing_response[0].id) {
                return responseHandler.successRequest({
                    name: 'create_earlybirds_list',
                    req, res,
                    message: "Already requested, Stay tunned 🤖!",
                })
            }

            const query_data = {
                email,
                params: params || "",
                status: '0'
            }

            const insert_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'INSERT',
                TABEL: mysqlTables.EARLYBIRD_LISTS,
                DATA: query_data
            })

            let response = await runPreparedQuery(insert_query.query, insert_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'create_earlybirds_list',
                req, res,
                message: "Failed to create earlybirds list, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'create_earlybirds_list',
                req, res,
                message: "Earlybirds list created successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'create_earlybirds_list', req, res })
        }

    }
    async update_earlybirds_list(req, res) {

        try {
            const { user_id, user_name, user_email } = req

            await payloadValidator.Validate({ name: 'update_earlybirds_list', req, res, payload: req.body })

            const {
                id,
                name,
                email,
                status,

            } = req.body

            const query_data = {
                name,
                status,
            }

            const update_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'UPDATE',
                TABEL: mysqlTables.EARLYBIRD_LISTS,
                DATA: query_data,
                VALID: {
                    id: id,
                }
            })

            let response = await runPreparedQuery(update_query.query, update_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'update_earlybirds_list',
                req, res,
                message: "Failed to update earlybirds list, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'update_earlybirds_list',
                req, res,
                message: "Earlybirds list update successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'update_earlybirds_list', req, res })
        }

    }


}

module.exports = Earlybirds;