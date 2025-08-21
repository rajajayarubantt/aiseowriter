require('dotenv')

const config = require('config')
const Utils = require("../../helpers/utils");
const mysqlTables = config.get('mysqlTables')
const { runPreparedQuery } = require('../../helpers/mysqlQuery')
const FieldsUpdate = require("../../helpers/FieldsUpdate");

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()


class Users {

    async get_users(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'get_users', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                columns,
                search,
            } = req.query

            let filter = {
                org_id
            }

            if (id) filter.id = id

            const DEFAULT_COLUMNS = "id,org_id,name,email,status,role_type"
            const COLUMNS = `${columns || DEFAULT_COLUMNS},created_at,created_by_name,updated_at,updated_by_name`

            const get_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: COLUMNS,
                TABEL: mysqlTables.USERS,
                VALID: filter
            })

            let response = await runPreparedQuery(get_query.query, get_query.value)

            return responseHandler.successRequest({
                name: 'get_users',
                req, res,
                message: "Users retrived successfully!",
                data: response
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_users', req, res })
        }

    }
    async create_user(req, res) {

        try {

            const { org_id, user_id, user_name, user_email } = req


            await payloadValidator.Validate({ name: 'create_user', req, res, payload: req.body })

            const {
                name,
                email,
            } = req.body

            const query_data = {
                org_id,
                name,
                email,
                role_type: 'user',
                onboarding_status: 1,

                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }

            const insert_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'INSERT',
                TABEL: mysqlTables.USERS,
                DATA: query_data
            })

            let response = await runPreparedQuery(insert_query.query, insert_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'create_user',
                req, res,
                message: "Failed to create user, Please try again!"
            })

            let update_credit_query = {
                payment_status: 'active',
                org_id: org_id
            }
            let update_credit_data = {
                $inc: {
                    "plan_details.users_count": -1
                }
            }

            await req.mongoDB.updateOne(mysqlTables.SUBSCRIPTIONS, update_credit_query, update_credit_data)


            return responseHandler.successRequest({
                name: 'create_user',
                req, res,
                message: "User created successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'create_user', req, res })
        }

    }
    async update_user(req, res) {

        try {
            const { org_id, user_id, user_name, user_email } = req

            await payloadValidator.Validate({ name: 'update_user', req, res, payload: req.body })

            const {
                id,
                name,
                email,
            } = req.body

            const query_data = {
                name,
                email,

                updated_by_id: user_id,
                updated_by_name: user_name || user_email,
            }

            const update_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'UPDATE',
                TABEL: mysqlTables.USERS,
                DATA: query_data,
                VALID: {
                    id: id,
                    org_id: org_id
                }
            })

            let response = await runPreparedQuery(update_query.query, update_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'update_user',
                req, res,
                message: "Failed to update user, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'update_user',
                req, res,
                message: "User update successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'update_user', req, res })
        }

    }
    async delete_user(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'delete_user', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const { id } = req.body


            const delete_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'DELETE',
                TABEL: mysqlTables.USERS,
                VALID: {
                    id: id,
                    org_id: org_id
                }
            })

            let response = await runPreparedQuery(delete_query.query, delete_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'delete_user',
                req, res,
                message: "Failed to delete user, Please try again!"
            })

            let update_credit_query = {
                payment_status: 'active',
                org_id: org_id
            }
            let update_credit_data = {
                $inc: {
                    "plan_details.users_count": +1
                }
            }

            await req.mongoDB.updateOne(mysqlTables.SUBSCRIPTIONS, update_credit_query, update_credit_data)

            return responseHandler.successRequest({
                name: 'delete_user',
                req, res,
                message: "User delete successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'delete_user', req, res })
        }

    }

}

module.exports = Users;