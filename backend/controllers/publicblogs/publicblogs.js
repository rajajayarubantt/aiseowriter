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

            console.log(get_query, options, 'get_query');

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

    async post(req, res) {
        try {

            const isPayloadInValid = await payloadValidator.Validate({ name: 'post_public_blogs', req, res, payload: req.body })
            if (isPayloadInValid) return isPayloadInValid

            const {
                title,
                content,
                content_markdown,
                thumbnail_alt_text,
                keywords,
                status,
                thumbnail,
                metadescription,
                language_code,
                article_schema,
                faq_schema
            } = req.body

            let insert_data = {
                "schedule_id": null,
                "org_id": null,
                "brand_id": null,
                "language_code": language_code || "en",
                "title": title,
                "url": title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                "content": content,
                "content_markdown": content_markdown || null,
                "coverImage": {
                    "alt": thumbnail_alt_text || "",
                    "caption": "",
                    "url": thumbnail || null
                },
                "words_count": content.split(" ").length,
                "metaDescription": metadescription || null,
                "category": null,
                "status": status || "draft",
                "keywords": keywords || "",
                "tags": [],
                "author": {
                    "name": "Founding Team",
                    "id": "1",
                    "profile_url": ""
                },
                "outlines": [],
                "faq_schema": faq_schema || null,
                "article_schema": article_schema || null,
                "createdAt": new Date().getTime(),
                "updatedAt": new Date().getTime(),
                "createdBy": "1",

                "likes": 0,
                "views": 0,
                "comments": 0,
                "isFeatured": false,
            }

            let response = await req.mongoDB.insertOne(mysqlTables.PUBLIC_BLOGS, insert_data)

            if (!response || !response.acknowledged) {
                return responseHandler.serverError({ name: 'post_public_blogs', req, res })
            }

            return responseHandler.successRequest({
                name: 'post_public_blogs',
                req, res,
                data: {
                    url: insert_data.url,
                },
                message: "Posted successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'post_public_blogs', req, res })
        }

    }

}

module.exports = PublicBlogs;