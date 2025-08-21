require('dotenv')

const config = require('config')
const { ObjectId } = require('mongodb');
const Utils = require("../../helpers/utils");
const mysqlTables = config.get('mysqlTables')

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()


class Sitemap {

    async get_sitemaps(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'get_sitemaps', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                columns,
                search,

            } = req.query

            let get_query = {
                'org_id': org_id
            }

            let options = {
                projection: {}
            }

            if (id) get_query['_id'] = new ObjectId(id)

            if (columns && columns.length && columns != "*") {

                String(columns).split(',')?.forEach(p => {

                    options.projection[p] = 1
                })

            }

            let response = await req.mongoDB.find(mysqlTables.SITEMAPS, get_query, options)

            const data = response.items?.map(i => {
                i.id = i._id

                return i
            })

            return responseHandler.successRequest({
                name: 'get_sitemaps',
                req, res,
                message: "Sitemaps retrived successfully!",
                data: data
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_sitemaps', req, res })
        }

    }

    async update_sitemap(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'update_sitemap', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req

            const { id, data } = req.body

            const update_query = {
                '_id': new ObjectId(id),
                'org_id': org_id
            }

            const update_data = {
                $set: {
                    ...data,
                    updated_at: Utils.getCurrentTimeStamp(),
                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email
                }
            }

            let mongo_response = await req.mongoDB.updateOne(mysqlTables.SITEMAPS, update_query, update_data)

            if (!mongo_response.acknowledged || !mongo_response.modifiedCount) {
                return responseHandler.failedRequest({
                    name: 'update_sitemap',
                    req, res,
                    message: "Failed to update sitemap, Please try again!"
                })
            }

            return responseHandler.successRequest({
                name: 'update_sitemap',
                req, res,
                message: "Sitemap updated successfully!"
            })


        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'update_sitemap', req, res })
        }
    }
    async activate_sitemap(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'activate_sitemap', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req

            const { id } = req.body

            const update_query = {
                '_id': new ObjectId(id),
                'org_id': org_id
            }

            let udpate_response = await req.mongoDB.updateMany(mysqlTables.SITEMAPS, { 'org_id': org_id }, { $set: { 'status': '0' } })

            const update_data = {
                $set: {

                    status: '1',

                    updated_at: Utils.getCurrentTimeStamp(),
                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email
                }
            }

            let mongo_response = await req.mongoDB.updateOne(mysqlTables.SITEMAPS, update_query, update_data)

            if (!mongo_response.acknowledged || !mongo_response.modifiedCount) {
                return responseHandler.failedRequest({
                    name: 'activate_sitemap',
                    req, res,
                    message: "Failed to activate sitemap, Please try again!"
                })
            }

            return responseHandler.successRequest({
                name: 'activate_sitemap',
                req, res,
                message: "Sitemap updated successfully!"
            })


        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'activate_sitemap', req, res })
        }
    }
    async import_sitemap(req, res) {

        try {

            const { org_id, user_id, user_name, user_email } = req

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'import_sitemap', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid


            const {
                sitemap_url,

            } = req.body


            const siteMetaData = await Utils.getSiteMetaFromSitemap(sitemap_url);
            const sitemapUrls = await Utils.getSitemapUrls(sitemap_url);

            const insert_data = {
                org_id,
                sitemap_url: Utils.normalizeUrl(sitemap_url),
                meta_data: siteMetaData,
                urls: sitemapUrls,
                status: '1',

                created_at: Utils.getCurrentTimeStamp(),
                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }


            let udpate_response = await req.mongoDB.updateMany(mysqlTables.SITEMAPS, { 'org_id': org_id }, { $set: { 'status': '0' } })
            let mongo_response = await req.mongoDB.insertOne(mysqlTables.SITEMAPS, insert_data)

            let update_credit_query = {
                payment_status: 'active',
                org_id: org_id
            }
            let update_credit_data = {
                $inc: {
                    "plan_details.sitemap_count": -1
                }
            }

            await req.mongoDB.updateOne(mysqlTables.SUBSCRIPTIONS, update_credit_query, update_credit_data)

            if (!mongo_response.acknowledged || !mongo_response.insertedId) return responseHandler.failedRequest({
                name: 'import_sitemap',
                req, res,
                message: "Failed to import sitemap, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'import_sitemap',
                req, res,
                message: "Sitemap created successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'import_sitemap', req, res })
        }

    }
    async refresh_sitemap(req, res) {

        try {

            const { org_id, user_id, user_name, user_email } = req

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'refresh_sitemap', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid


            const {
                id,

            } = req.body


            const get_query = {
                _id: new ObjectId(id),
                org_id: org_id
            }

            let options = {
                projection: {
                    sitemap_url: 1
                }
            }

            let sitemap_response = await req.mongoDB.findOne(mysqlTables.SITEMAPS, get_query, options)

            if (!sitemap_response) return responseHandler.failedRequest({
                name: 'refresh_sitemap',
                req, res,
                message: "Sitemap not found, Please try again!"
            })


            const sitemap_url = sitemap_response.sitemap_url

            if (!sitemap_url) return responseHandler.failedRequest({
                name: 'refresh_sitemap',
                req, res,
                message: "Sitemap URL is missing, Please try again!"
            })


            const siteMetaData = await Utils.getSiteMetaFromSitemap(sitemap_url);
            const sitemapUrls = await Utils.getSitemapUrls(sitemap_url);

            const update_data = {
                $set: {
                    meta_data: siteMetaData,
                    urls: sitemapUrls,
                    status: '1',

                    updated_at: Utils.getCurrentTimeStamp(),
                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }
            }

            let mongo_response = await req.mongoDB.updateOne(mysqlTables.SITEMAPS, get_query, update_data)

            if (!mongo_response.acknowledged || !mongo_response.modifiedCount) return responseHandler.failedRequest({
                name: 'refresh_sitemap',
                req, res,
                message: "Failed to refresh sitemap, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'refresh_sitemap',
                req, res,
                message: "Sitemap refreshed successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'refresh_sitemap', req, res })
        }

    }
    async delete_sitemap(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'delete_sitemap', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const { id } = req.body


            const delete_query = {
                _id: new ObjectId(id),
                org_id: org_id
            }


            let response = await req.mongoDB.deleteOne(mysqlTables.SITEMAPS, delete_query)

            let update_credit_query = {
                payment_status: 'active',
                org_id: org_id
            }
            let update_credit_data = {
                $inc: {
                    "plan_details.sitemap_count": +1
                }
            }

            await req.mongoDB.updateOne(mysqlTables.SUBSCRIPTIONS, update_credit_query, update_credit_data)


            if (!response.acknowledged || !response.deletedCount) return responseHandler.failedRequest({
                name: 'delete_article',
                req, res,
                message: "Failed to delete sitemap, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'delete_sitemap',
                req, res,
                message: "Sitemap deleted successfully!"
            })


        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'delete_sitemap', req, res })
        }

    }


}

module.exports = Sitemap;   