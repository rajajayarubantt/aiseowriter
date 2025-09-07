require('dotenv')

const { ObjectId } = require('mongodb');
const config = require('config')
const mysqlTables = config.get('mysqlTables')
const Utils = require('../../helpers/utils')

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const PlatfromHandler = require('../../services/platform')
const platfromHandler = new PlatfromHandler()

class Platforms {

    async post_platform(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'post_platform', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            const {
                article_id,
                platform
            } = req.body

            let response = await platfromHandler.post({ org_id, article_id, platform })

            response = response.data


            if (!response.success) return responseHandler.failedRequest({
                name: 'post_platform',
                req, res,
                message: "Failed to post, Please check! " + response.message,
            })

            return responseHandler.successRequest({
                name: 'post_platform',
                req, res,
                message: "Posted successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'post_platform', req, res })
        }

    }


}

module.exports = Platforms;