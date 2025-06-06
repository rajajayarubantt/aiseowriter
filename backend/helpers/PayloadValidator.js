
const Schemas = require('../schemas/schemas')
const ResponseHandler = require('./ResponseHandler')
const responseHandler = new ResponseHandler()

class PayloadValidator {

  async Validate({ name, req, res, payload }) {

    const { error } = Schemas[name].validate(payload)

    const Valid = error ? false : true

    if (!Valid) {

      return responseHandler.invalidParams({ req, res, name })

    }

  }
}





module.exports = PayloadValidator;