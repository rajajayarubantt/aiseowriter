
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()


class PublicBlogs {

    async get_public_blogs_lists(req, res) {

        try {

            await payloadValidator.Validate({ name: 'get_public_blogs_lists', req, res, payload: req.query })

            let { id, slug, search, category, page, limit } = req.query

            page = page || 1
            limit = limit || 10

            const get_query = {}

            if (id) get_query['_id'] = id
            if (slug) get_query['url'] = slug
            if (category) get_query['category'] = { $regex: category, $options: 'i' }

            let response = await req.mongoDB.find("public_blogs", get_query, { page, limit })

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