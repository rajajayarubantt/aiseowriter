const { ObjectId } = require('mongodb');
const config = require('config')
const mysqlTables = config.get('mysqlTables')

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()


class PublicBlogs {

    async get_public_blogs_lists(req, res) {

        try {

            const isPayloadInValid = await payloadValidator.Validate({ name: 'get_public_blogs_lists', req, res, payload: req.query })

            if (isPayloadInValid) return isPayloadInValid

            let { id, slug, search, category, page, limit, projection } = req.query
            console.log(req.query, 'req.query');


            const get_query = {}

            if (id) get_query['_id'] = new ObjectId(id)
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

            return responseHandler.successRequest({
                name: 'get_public_blogs_lists',
                req, res,
                message: "Public Blogs lists retrived successfully!",
                data: response
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_public_blogs_lists', req, res })
        }

    }

}

module.exports = PublicBlogs;