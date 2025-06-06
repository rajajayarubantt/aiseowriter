const config = require('config')
const mysqlTables = config.get('mysqlTables')
const FieldsUpdate = require('../../helpers/FieldsUpdate')
const { runPreparedQuery } = require('../../helpers/mysqlQuery')
const Utils = require('../../helpers/utils')

const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

class Roles {

    async getroles(req, res) {

        await payloadValidator.Validate({ name: 'getroles', req, res })
    }


}


module.exports = Roles