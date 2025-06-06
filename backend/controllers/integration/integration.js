require('dotenv')

const config = require('config')
const mysqlTables = config.get('mysqlTables')
const { runPreparedQuery } = require('../../helpers/mysqlQuery')
const FieldsUpdate = require("../../helpers/FieldsUpdate");
const axios = require('axios')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler');
const Utils = require('../../helpers/utils');
const responseHandler = new ResponseHandler()


class Integration {

    constructor() {

        this.LINKEDIN_BASE_URL = process.env.LINKEDIN_BASE_URL;
        this.LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
        this.LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
        this.LINKEDIN_SCOPE = process.env.LINKEDIN_SCOPE;
        this.LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

        this.linkedin_auth_callback = this.linkedin_auth_callback.bind(this)
        this.auth_integration = this.auth_integration.bind(this)
    }

    async get_connections(req, res) {

        try {

            const { org_id, user_id, user_name, user_email } = req

            const COLUMNS = 'id,name,`key`,status,last_synced'

            const get_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: COLUMNS,
                TABEL: mysqlTables.BLOG_PLATFORMS,
                VALID: {
                    org_id: org_id
                }
            })

            let response = await runPreparedQuery(get_query.query, get_query.value)

            return responseHandler.successRequest({
                name: 'get_connections',
                req, res,
                message: "Integration connections retrived successfully!",
                data: response
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'get_connections', req, res })
        }

    }
    async auth_integration(req, res) {

        try {
            await payloadValidator.Validate({ name: 'auth_integration', req, res, payload: req.query })

            const { org_id, user_id, user_name, user_email } = req
            const { app } = req.query

            const get_linkedin_auth_url = (state) => {

                const BASE_URL = this.LINKEDIN_BASE_URL;
                const CLIENT_ID = this.LINKEDIN_CLIENT_ID;
                const SCOPE = this.LINKEDIN_SCOPE;
                const STATE = state;
                const REDIRECT_URI = this.LINKEDIN_REDIRECT_URI;

                return `${BASE_URL}/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}`;

            }

            if (app == 'linkedin') {

                const auth_url = get_linkedin_auth_url(org_id)

                return responseHandler.successRequest({
                    name: 'auth_integration',
                    req, res,
                    message: "Schedule created successfully!",
                    data: {
                        auth_url
                    },
                })
            }

        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'auth_integration', req, res })
        }

    }
    async linkedin_auth_callback(req, res) {

        try {
            await payloadValidator.Validate({ name: 'linkedin_auth_callback', req, res, payload: req.query })

            const { code, state } = req.query

            const get_org_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: 'id, name, email',
                TABEL: mysqlTables.USERS,
                VALID: {
                    org_id: state,
                    role_type: 'admin'
                }
            })

            let get_org_response = await runPreparedQuery(get_org_query.query, get_org_query.value)

            if (!get_org_response.length) return Utils.close_windows(res)

            let { id: user_id, name: user_name, email: user_email } = get_org_response[0]

            const BASE_URL = this.LINKEDIN_BASE_URL;
            const CLIENT_ID = this.LINKEDIN_CLIENT_ID;
            const CLIENT_SECRET = this.LINKEDIN_CLIENT_SECRET;
            const REDIRECT_URI = this.LINKEDIN_REDIRECT_URI;

            const token_res = await axios.post(`${BASE_URL}/accessToken`,
                new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    redirect_uri: REDIRECT_URI,
                })
            );

            console.log(token_res.data, 'token_res.data');

            const { access_token, refresh_token, expires_in } = token_res.data;

            const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: 'id',
                TABEL: mysqlTables.BLOG_PLATFORMS,
                VALID: {
                    '`key`': 'linkedin',
                    org_id: state
                }
            })

            let check_platform_response = await runPreparedQuery(check_platform_query.query, check_platform_query.value)

            if (check_platform_response.length) {

                const { id } = check_platform_response[0]

                const query_data = {
                    status: '1',
                    auth_type: 'oauth',
                    oauth_token: access_token,
                    oauth_refresh_token: refresh_token,

                    oauth_expiry: Utils.getCurrentTimeStamp(Date.now() + expires_in * 1000),
                    last_synced: Utils.getCurrentTimeStamp(),

                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }

                const update_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'UPDATE',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    DATA: query_data,
                    VALID: { id }
                })

                let response = await runPreparedQuery(update_query.query, update_query.value)

            }
            else {
                const query_data = {
                    org_id: state,
                    name: 'LinkedIn',
                    '`key`': 'linkedin',
                    status: '1',
                    auth_type: 'oauth',
                    oauth_token: access_token,
                    oauth_refresh_token: refresh_token,

                    oauth_expiry: Utils.getCurrentTimeStamp(Date.now() + expires_in * 1000),
                    last_synced: Utils.getCurrentTimeStamp(),

                    created_by_id: user_id,
                    created_by_name: user_name || user_email,
                }

                const insert_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'INSERT',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    DATA: query_data
                })

                let response = await runPreparedQuery(insert_query.query, insert_query.value)
            }



            return Utils.close_windows(res)
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'linkedin_auth_callback', req, res })
        }

    }

    async delete_connection(req, res) {

        try {
            await payloadValidator.Validate({ name: 'delete_connection', req, res, payload: req.body })

            const { org_id, user_id, user_name, user_email } = req
            const { id } = req.body


            const delete_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'DELETE',
                TABEL: mysqlTables.BLOG_PLATFORMS,
                VALID: {
                    id: id,
                    org_id: org_id
                }
            })

            let response = await runPreparedQuery(delete_query.query, delete_query.value)

            console.log(delete_query, 'response');


            if (!response.affectedRows) return responseHandler.failedRequest({
                name: 'delete_connection',
                req, res,
                message: "Failed to remove connection, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'delete_connection',
                req, res,
                message: "Connection removed successfully!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'delete_connection', req, res })
        }

    }


}

module.exports = Integration;