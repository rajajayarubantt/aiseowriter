require('dotenv')

const config = require('config')
const BASE_URL = config.get('BASE_URL')
const mysqlTables = config.get('mysqlTables')
const Utils = require("../../helpers/utils");
const AuthHelper = require('../../helpers/auth')
const { runPreparedQuery } = require('../../helpers/mysqlQuery')
const requestIp = require('request-ip');
const FieldsUpdate = require("../../helpers/FieldsUpdate");
const axios = require('axios')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

const { TemplatedMailer } = require('../../helpers/templatedMailer')


const SubscriptionController = require('../subscriptions/subscriptions')
const subscriptionController = new SubscriptionController()

class Auth {

    async register(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'register', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid
            const { email } = req.body


            const check_user_exist = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id, status`,
                TABEL: mysqlTables.USERS,
                VALID: {
                    email: email
                }
            })

            let check_user_exist_res = await runPreparedQuery(check_user_exist.query, check_user_exist.value)
            check_user_exist_res = check_user_exist_res[0]

            const is_exist_user = check_user_exist_res && check_user_exist_res.id

            const magic_token = await AuthHelper.GenerateJWTToken({ email })
            const IP = requestIp.getClientIp(req)

            if (!is_exist_user) {
                // register code

                const org_id = Utils.getUniqueId()

                let subscription_response = await subscriptionController.subscribe_free_plan({
                    email,
                    org_id,
                    req
                })

                if (!subscription_response) return responseHandler.failedRequest({
                    name: 'register',
                    req, res,
                    message: "Failed to subscribe to free plan, Please try again!"
                })

                let register_data = {
                    email,
                    role_type: 'admin',
                    status: 1,
                    login_token: magic_token,
                    org_id: org_id,
                    created_by_id: email,
                    created_by_name: email,
                }

                const register_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'INSERT',
                    TABEL: mysqlTables.USERS,
                    DATA: register_data
                })

                let response = await runPreparedQuery(register_query.query, register_query.value)

                if (!response.affectedRows) return responseHandler.failedRequest({
                    name: 'register',
                    req, res,
                    message: "Failed to register, Please try again!"
                })


            }
            else {
                // login code

                let login_data = {
                    login_token: magic_token,
                    updated_by_id: email,
                    updated_by_name: email,
                }
                if (!check_user_exist_res.status) login_data.status = '1'

                const login_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'UPDATE',
                    TABEL: mysqlTables.USERS,
                    DATA: login_data,
                    VALID: {
                        email
                    }
                })

                let response = await runPreparedQuery(login_query.query, login_query.value)

                if (!response.affectedRows) return responseHandler.failedRequest({
                    name: 'register',
                    req, res,
                    message: "Failed to login, Please try again!"
                })
            }

            const magic_link = `${BASE_URL}/api/v1/auth/verifylogin?token=${magic_token}&email=${email}`

            console.log(magic_link, 'magic_link \n');


            let mail_response = await TemplatedMailer({
                to: email,
                message: 'Verify your Login',
                subject: 'Verify your Login',
                template_name: 'VerifyLogin',
                template_data: { magic_link: magic_link }
            })

            if (!mail_response.success) return responseHandler.failedRequest({
                name: 'register',
                req, res,
                message: "Failed to send magic link, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'register',
                req, res,
                message: "Please check inbox for magic link!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'register', req, res })
        }

    }

    async verifylogin(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'verifylogin', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid
            const { email, token } = req.query

            const is_token_valid = await AuthHelper.ValidateJWT(token)

            if (!is_token_valid.success) return responseHandler.failedRequest({ req, res, message: "Failed to login, Please try again!" })

            const get_user_details = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id, name, email, org_id, status, role_type, onboarding_status`,
                TABEL: mysqlTables.USERS,
                VALID: {
                    email: email
                }
            })

            let get_user_details_res = await runPreparedQuery(get_user_details.query, get_user_details.value)

            get_user_details_res = get_user_details_res[0]

            if (!get_user_details_res) return responseHandler.failedRequest({
                name: 'verifylogin',
                req, res,
                message: "No user found, Please try to register!"
            })

            const login_token = await AuthHelper.GenerateJWTToken({
                id: get_user_details_res.id,
                org_id: get_user_details_res.org_id,
                name: get_user_details_res.name,
                email: get_user_details_res.email,
                role_type: get_user_details_res.role_type,
            })

            const json_userdetails = JSON.stringify(get_user_details_res)

            res.cookie("access_token", login_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 24 * 15 * 60 * 1000) })
            res.cookie("userdetails", json_userdetails, { httpOnly: true, expires: new Date(Date.now() + 60 * 24 * 15 * 60 * 1000) })

            const redirect_url = `${BASE_URL}/verify-login?access_token=${login_token}&userdetails=${json_userdetails}`

            return res.redirect(redirect_url)

        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'verifylogin', req, res })
        }

    }
    async verifyGoogleAuth(req, res) {
        try {

            const { code } = req.query

            if (!code) return responseHandler.failedRequest({
                name: 'verifyGoogleAuth',
                req, res,
            })

            const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
                code: code,
                client_id: config.get("GOOGLE_CLIENT_ID"),
                client_secret: config.get("GOOGLE_CLIENT_SECRET"),
                redirect_uri: config.get("GOOGLE_REDIRECT_URL"),
                grant_type: "authorization_code"
            });

            if (!tokenResponse.data) return responseHandler.failedRequest({
                name: 'verifyGoogleAuth',
                req, res,
            })

            const { access_token } = tokenResponse.data;

            const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            if (!userInfoResponse.data) return responseHandler.failedRequest({
                name: 'verifyGoogleAuth',
                req, res,
            })

            const { sub, name, given_name, family_name, picture, email, email_verified } = userInfoResponse.data

            const check_user_exist = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: `id, name, email, org_id, status, role_type, onboarding_status`,
                TABEL: mysqlTables.USERS,
                VALID: {
                    email: email
                }
            })

            let check_user_exist_res = await runPreparedQuery(check_user_exist.query, check_user_exist.value)
            check_user_exist_res = check_user_exist_res[0]

            const is_exist_user = check_user_exist_res && check_user_exist_res.id

            if (!is_exist_user) {

                const org_id = Utils.getUniqueId()

                let register_data = {
                    name: name,
                    google_id: sub,
                    email,
                    role_type: 'admin',
                    status: 1,
                    login_token: "",
                    org_id: org_id,
                    created_by_id: email,
                    created_by_name: email,
                }

                const register_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'INSERT',
                    TABEL: mysqlTables.USERS,
                    DATA: register_data
                })

                let response = await runPreparedQuery(register_query.query, register_query.value)

                if (!response.affectedRows) return responseHandler.failedRequest({
                    name: 'verifyGoogleAuth',
                    req, res,
                    message: "Failed to register, Please try again!"
                })

                check_user_exist_res = await runPreparedQuery(check_user_exist.query, check_user_exist.value)
                check_user_exist_res = check_user_exist_res[0]
            }

            const login_token = await AuthHelper.GenerateJWTToken({
                id: check_user_exist_res.id,
                org_id: check_user_exist_res.org_id,
                name: check_user_exist_res.name,
                email: check_user_exist_res.email,
                role_type: check_user_exist_res.role_type,
            })

            const json_userdetails = JSON.stringify(check_user_exist_res)

            res.cookie("access_token", login_token, { httpOnly: true, expires: new Date(Date.now() + 60 * 24 * 15 * 60 * 1000) })
            res.cookie("userdetails", json_userdetails, { httpOnly: true, expires: new Date(Date.now() + 60 * 24 * 15 * 60 * 1000) })

            const redirect_url = `${BASE_URL}/verify-login?access_token=${login_token}&userdetails=${json_userdetails}`

            console.log(redirect_url, 'redirect_url');

            return res.redirect(redirect_url)


        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'verifyGoogleAuth', req, res })
        }

    }

    async onboard(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'onboard', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid
            const { user_id, user_name, user_email } = req
            const { details } = req.body
            let { name } = details


            const update_user_details = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'UPDATE',
                TABEL: mysqlTables.USERS,
                DATA: {
                    name: name,
                    onboarding_status: '1',
                    onboarding_details: JSON.stringify(details || "{}"),
                    updated_by_id: user_id,
                    updated_by_name: user_name,
                },
                VALID: {
                    id: user_id
                },
            })

            let update_user_details_res = await runPreparedQuery(update_user_details.query, update_user_details.value)

            if (!update_user_details_res.affectedRows) return responseHandler.failedRequest({
                name: 'onboard',
                req, res,
                message: "Failed to onboard, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'onboard',
                req, res,
                message: "Onboarding completed succesfully!",
            })

        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'onboard', req, res })
        }
    }


}

module.exports = Auth;