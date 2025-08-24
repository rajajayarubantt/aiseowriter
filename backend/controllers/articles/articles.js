require('dotenv')

const { ObjectId } = require('mongodb');
const config = require('config')
const mysqlTables = config.get('mysqlTables')


const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

const Utils = require('../../helpers/utils')

const GeneratorHandler = require('../../services/generator')
const generatorHandler = new GeneratorHandler()

class Articles {


    async get_articles(req, res) {

        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'get_articles', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                columns,
                slug,
                category,
                search,
                page, limit
            } = req.query

            const get_query = {
                'org_id': org_id
            }

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

            if (columns && columns.length && columns != "*") {

                String(columns).split(',')?.forEach(p => {

                    options.projection[p] = 1
                })

            }

            let response = await req.mongoDB.find(mysqlTables.MONGO_BLOGS, get_query, options)
            let summary_response = await req.mongoDB.aggregate(mysqlTables.MONGO_BLOGS, [
                {
                    '$match': {
                        org_id: org_id
                    }
                },
                {
                    '$group': {
                        _id: "$status",
                        count: { '$sum': 1 }
                    }
                }
            ])

            const data = response.items?.map(i => {
                i.id = i._id

                return i
            })

            const summary_data = Object.fromEntries(summary_response.map(({ _id, count }) => [_id, count]))

            return responseHandler.successRequest({
                name: 'get_articles',
                req, res,
                message: "Articles retrived successfully!",
                data: data,
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
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'generate_title', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                keywords,
                cover_image,
                language,
                brand_id,
                brand_name,
                description,
            } = req.body


            const generate_title_payload = {
                "Topic Description": description || "Create a high-quality blog based on the given inputs",
                "Language": language || "English",
                "Keywords to include": keywords.join(', '),
                "Desired Outline Count": "10",
                "Tone of Voice": "Professional",
                "Point of View": "First person singular (I)"
            }

            if (brand_name) generate_title_payload['Brand Name'] = brand_name

            let generate_response = await generatorHandler.generate_titles(generate_title_payload)

            if (generate_response.status != 200 || !generate_response.data.success) return responseHandler.failedRequest({
                name: 'generate_title',
                req, res,
                message: "Failed to generate article title, Please try again!"
            })

            const { title, outline } = generate_response.data.data

            const insert_data = {
                org_id,
                keywords,
                cover_image: {
                    ratio: cover_image,
                    url: '',
                    alt: ''
                },
                title: title[0],
                title_options: title,
                outlines: outline,
                content: '',
                words: 0,
                meta_description: '',
                language,
                brand_id,
                description: description || "",

                schedule_id: null,
                status: 0,
                author: {
                    name: user_name,
                    id: user_id,
                    profile_url: ''
                },


                created_at: Utils.getCurrentTimeStamp(),
                created_by_id: user_id,
                created_by_name: user_name || user_email,
            }

            let mongo_response = await req.mongoDB.insertOne(mysqlTables.MONGO_BLOGS, insert_data)

            let update_credit_query = {
                payment_status: 'active',
                org_id: org_id
            }
            let update_credit_data = {
                $inc: {
                    balance_credits: -1,
                    "plan_details.blog_count": -1
                }
            }

            if (cover_image) {
                update_credit_data['$inc']['plan_details.image_count'] = -1
            }

            await req.mongoDB.updateOne(mysqlTables.SUBSCRIPTIONS, update_credit_query, update_credit_data)

            if (!mongo_response.acknowledged || !mongo_response.insertedId) return responseHandler.failedRequest({
                name: 'generate_title',
                req, res,
                message: "Failed to generate article title, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'generate_title',
                req, res,
                message: "Article title generated successfully!",
                data: {
                    id: mongo_response.insertedId
                }
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'generate_title', req, res })
        }

    }
    async regenerate_title(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'generate_title', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                keywords,
                language,
                brand_id,
                brand_name,
                description,
            } = req.body

            if (!id) {
                return responseHandler.invalidParams({
                    name: 'generate_title',
                    req, res,
                })
            }

            const generate_title_payload = {
                "Topic Description": description || "Create a high-quality blog based on the given inputs",
                "Language": language || "English",
                "Keywords to include": keywords.join(', '),
                "Desired Outline Count": "10",
                "Tone of Voice": "Professional",
                "Point of View": "First person singular (I)"
            }

            if (brand_name) generate_title_payload['Brand Name'] = brand_name

            let generate_response = await generatorHandler.generate_only_titles(generate_title_payload)

            if (generate_response.status != 200 || !generate_response.data.success) return responseHandler.failedRequest({
                name: 'generate_title',
                req, res,
                message: "Failed to generate article title, Please try again!"
            })

            const { title } = generate_response.data.data

            const mongo_update_data = {
                $set: {
                    title: title[0],
                    title_options: title,
                    updated_at: Utils.getCurrentTimeStamp(),
                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }
            }

            const filter = {
                _id: new ObjectId(id),
                org_id: org_id
            }

            let mongo_response = await req.mongoDB.updateOne(mysqlTables.MONGO_BLOGS, filter, mongo_update_data)

            if (!mongo_response.acknowledged) return responseHandler.failedRequest({
                name: 'generate_title',
                req, res,
                message: "Failed to update article title, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'generate_title',
                req, res,
                message: "Article title updated successfully!",
                data: {
                    title_options: title
                }
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'generate_title', req, res })
        }

    }
    async regenerate_outlines(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'generate_title', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                id,
                keywords,
                language,
                brand_id,
                brand_name,
                description,
            } = req.body

            if (!id) {
                return responseHandler.invalidParams({
                    name: 'generate_title',
                    req, res,
                })
            }


            const generate_title_payload = {
                "Topic Description": description || "Create a high-quality blog based on the given inputs",
                "Language": language || "English",
                "Keywords to include": keywords.join(', '),
                "Desired Outline Count": "10",
                "Tone of Voice": "Professional",
                "Point of View": "First person singular (I)"
            }

            if (brand_name) generate_title_payload['Brand Name'] = brand_name

            let generate_response = await generatorHandler.generate_only_outlines(generate_title_payload)

            if (generate_response.status != 200 || !generate_response.data.success) return responseHandler.failedRequest({
                name: 'generate_title',
                req, res,
                message: "Failed to generate article outlines, Please try again!"
            })

            const { outline } = generate_response.data.data

            const mongo_update_data = {
                $set: {
                    outlines: outline,

                    updated_at: Utils.getCurrentTimeStamp(),
                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }
            }

            const filter = {
                _id: new ObjectId(id),
                org_id: org_id
            }

            let mongo_response = await req.mongoDB.updateOne(mysqlTables.MONGO_BLOGS, filter, mongo_update_data)

            if (!mongo_response.acknowledged) return responseHandler.failedRequest({
                name: 'generate_title',
                req, res,
                message: "Failed to update article outline, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'generate_title',
                req, res,
                message: "Article outline updated successfully!",
                data: {
                    outlines: outline
                }
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'generate_title', req, res })
        }

    }
    async generate_content(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'generate_content', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req

            const {
                id,
                title,
                title_options,
                keywords,
                outlines,
                description,
                language,
                brand_name,
                tone,
                view,
                length,
                inter_links,
            } = req.body


            let get_response = await req.mongoDB.find(mysqlTables.MONGO_BLOGS, { '_id': new ObjectId(id) })

            if (!get_response.items.length) return responseHandler.failedRequest({
                name: 'generate_content',
                req, res,
                message: "Failed to generate article, Please try again!"
            })

            const blog_data = get_response.items[0]

            let cover_image = blog_data?.cover_image

            const generate_article_payload = {
                "Blog Title": title,
                "Blog Outlines": outlines,
                "Topic Description": description || "Create a high-quality blog based on the given inputs",
                "Language": language || "English",
                "Keywords to include": keywords.join(', '),
                "Tone of Voice": tone || "Professional",
                "Point of View": view || "First person singular (I)",
                "Words Count": length || '700+',
                "cover_image": cover_image?.ratio || null
            }

            if (inter_links) {

                let get_query = {
                    'org_id': org_id,
                    'status': '1'
                }

                let options = {
                    projection: {
                        'urls': 1
                    }
                }


                let sitemap_response = await req.mongoDB.findOne(mysqlTables.SITEMAPS, get_query, options)

                let sitemap_urls = sitemap_response ? sitemap_response?.urls || [] : []

                if (sitemap_urls.length) generate_article_payload['Internal Sitemap Links (Use only if relevant to context)'] = sitemap_urls
            }

            if (brand_name) generate_article_payload['Brand Name'] = brand_name

            let generate_response = await generatorHandler.generate_article(generate_article_payload)

            if (generate_response.status != 200 || !generate_response.data.success) return responseHandler.failedRequest({
                name: 'generate_content',
                req, res,
                message: "Failed to generate article, Please try again!"
            })

            const article_content = generate_response.data.data.content
            const cover_image_data = generate_response.data.data.cover_image || {}
            const meta_description = generate_response.data.data.meta_description || ""
            const ai_image_generation_prompt = generate_response.data.data.ai_image_generation_prompt || ""
            const faq_schema = generate_response.data.data.faq_schema || {}
            const article_schema = generate_response.data.data.article_schema || {}

            const mongo_update_data = {
                $set: {
                    title: title,
                    title_options: title_options,
                    outlines: outlines,
                    tone: tone,
                    view: view,
                    length: length,
                    inter_links: inter_links,
                    content: article_content,
                    status: 1,
                    meta_description: meta_description,
                    faq_schema: faq_schema,
                    article_schema: article_schema,
                    cover_image: {
                        ratio: cover_image,
                        ai_image_generation_prompt: ai_image_generation_prompt,
                        ...cover_image_data
                    },
                    updated_at: Utils.getCurrentTimeStamp(),
                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }
            }

            const filter = {
                _id: new ObjectId(id),
                org_id: org_id
            }

            let mongo_response = await req.mongoDB.updateOne(mysqlTables.MONGO_BLOGS, filter, mongo_update_data)

            if (!mongo_response.acknowledged) return responseHandler.failedRequest({
                name: 'generate_content',
                req, res,
                message: "Failed to update article, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'generate_content',
                req, res,
                message: "Article title generated successfully!",
                data: {
                    content: article_content,
                    cover_image: {
                        ratio: cover_image,
                        ...cover_image_data
                    }
                }
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'generate_content', req, res })
        }

    }

    async update_article(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'update_article', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req

            const {
                id,
                title,
                content,
                cover_image
            } = req.body


            const mongo_update_data = {
                $set: {
                    title: title,
                    content: content,
                    cover_image: cover_image,

                    updated_at: Utils.getCurrentTimeStamp(),
                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }
            }

            const filter = {
                _id: new ObjectId(id),
                org_id: org_id
            }

            let mongo_response = await req.mongoDB.updateOne(mysqlTables.MONGO_BLOGS, filter, mongo_update_data)

            if (!mongo_response.acknowledged) return responseHandler.failedRequest({
                name: 'update_article',
                req, res,
                message: "Failed to update article, Please try again!"
            })


            return responseHandler.successRequest({
                name: 'update_article',
                req, res,
                message: "Article updated successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'update_article', req, res })
        }

    }

    async delete_article(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'delete_article', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const { id } = req.body

            const delete_query = {
                _id: new ObjectId(id),
                org_id: org_id
            }


            let response = await req.mongoDB.deleteOne(mysqlTables.MONGO_BLOGS, delete_query)


            if (!response.acknowledged || !response.deletedCount) return responseHandler.failedRequest({
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