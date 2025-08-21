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


class Brands {

    async get_brands(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'get_brands', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                columns,
                search,
                industry,
                category,

            } = req.query

            let filter = {
                org_id
            }

            if (id) filter.id = id
            if (industry) filter.industry = industry
            if (category) filter.category = category

            const DEFAULT_COLUMNS = "id,org_id,logo,name,description,industry,category"
            const COLUMNS = `${columns || DEFAULT_COLUMNS},created_at,created_by_name,updated_at,updated_by_name`

            const get_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: COLUMNS,
                TABEL: mysqlTables.BRANDS,
                VALID: filter
            })

            let response = await runPreparedQuery(get_query.query, get_query.value)

            return responseHandler.successRequest({
                name: 'get_brands',
                req, res,
                message: "Brands retrived successfully!",
                data: response
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_brands', req, res })
        }

    }
    async create_brand(req, res) {

        try {

            const { org_id, user_id, user_name, user_email } = req

            const Mult_Upload = MulterUploader.imageUpload.fields([{ name: "logo", maxCount: 1 }])

            Mult_Upload(req, res, async (err) => {

                if (err) {
                    console.log(err, 'err');
                    return responseHandler.serverError({ name: 'create_brand', req, res })
                }

                const isPayloadInvalid = await payloadValidator.Validate({ name: 'create_brand', req, res, payload: req.body })
                if (isPayloadInvalid) return isPayloadInvalid

                const logo = req.files['logo'] ? Utils.base64_encode(req.files['logo'][0].path) : null;

                const {
                    name,
                    description,
                    industry,
                    category,
                    website,
                    brand_template,
                } = req.body

                const query_data = {
                    org_id,
                    name,
                    description,
                    industry,
                    category,
                    website,
                    brand_template,
                    logo: logo,

                    created_by_id: user_id,
                    created_by_name: user_name || user_email,
                }

                const insert_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'INSERT',
                    TABEL: mysqlTables.BRANDS,
                    DATA: query_data
                })

                let response = await runPreparedQuery(insert_query.query, insert_query.value)

                if (!response.affectedRows) return responseHandler.failedRequest({
                    name: 'create_brand',
                    req, res,
                    message: "Failed to create brand, Please try again!"
                })


                return responseHandler.successRequest({
                    name: 'create_brand',
                    req, res,
                    message: "Brand created successfully!",
                })
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'create_brand', req, res })
        }

    }
    async update_brand(req, res) {

        try {
            const { org_id, user_id, user_name, user_email } = req

            const Mult_Upload = MulterUploader.imageUpload.fields([{ name: "logo", maxCount: 1 }])

            Mult_Upload(req, res, async (err) => {

                if (err) {
                    console.log(err, 'err');
                    return responseHandler.serverError({ name: 'update_brand', req, res })
                }

                const logo = req.files['logo'] ? Utils.base64_encode(req.files['logo'][0].path) : null;

                const isPayloadInvalid = await payloadValidator.Validate({ name: 'update_brand', req, res, payload: req.body })
                if (isPayloadInvalid) return isPayloadInvalid


                const {
                    id,
                    name,
                    description,
                    industry,
                    category,
                    website,
                    brand_template,
                } = req.body

                const query_data = {
                    name,
                    description,
                    industry,
                    category,
                    website,
                    brand_template,
                    logo: logo,

                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }

                const update_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'UPDATE',
                    TABEL: mysqlTables.BRANDS,
                    DATA: query_data,
                    VALID: {
                        id: id,
                        org_id: org_id
                    }
                })

                let response = await runPreparedQuery(update_query.query, update_query.value)

                if (!response.affectedRows) return responseHandler.failedRequest({
                    name: 'update_brand',
                    req, res,
                    message: "Failed to update brand, Please try again!"
                })

                return responseHandler.successRequest({
                    name: 'update_brand',
                    req, res,
                    message: "Brand update successfully!",
                })
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'update_brand', req, res })
        }

    }
    async delete_brand(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'delete_brand', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const { id } = req.body


            const delete_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'DELETE',
                TABEL: mysqlTables.BRANDS,
                VALID: {
                    id: id,
                    org_id: org_id
                }
            })

            let response = await runPreparedQuery(delete_query.query, delete_query.value)

            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'delete_brand',
                req, res,
                message: "Failed to delete brand, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'delete_brand',
                req, res,
                message: "Brand delete successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'delete_brand', req, res })
        }

    }

}

module.exports = Brands;