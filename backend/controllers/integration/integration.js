require('dotenv')

const qs = require('qs');
const config = require('config')
const mysqlTables = config.get('mysqlTables')
const integrationsConfig = config.get('integrations')

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

        this.LINKEDIN_BASE_URL = integrationsConfig.linkedin.base_url
        this.LINKEDIN_CLIENT_ID = integrationsConfig.linkedin.client_id
        this.LINKEDIN_CLIENT_SECRET = integrationsConfig.linkedin.client_secret
        this.LINKEDIN_SCOPE = integrationsConfig.linkedin.scope
        this.LINKEDIN_REDIRECT_URI = integrationsConfig.linkedin.redirection_url

        this.WORDPRESS_BASE_URL = integrationsConfig.wordpress.base_url
        this.WORDPRESS_AUTH_URL = integrationsConfig.wordpress.auth_url
        this.WORDPRESS_CLIENT_ID = integrationsConfig.wordpress.client_id
        this.WORDPRESS_CLIENT_SECRET = integrationsConfig.wordpress.client_secret
        this.WORDPRESS_SCOPE = integrationsConfig.wordpress.scope
        this.WORDPRESS_REDIRECT_URI = integrationsConfig.wordpress.redirection_url

        this.NOTION_BASE_URL = integrationsConfig.notion.base_url
        this.NOTION_CLIENT_ID = integrationsConfig.notion.client_id
        this.NOTION_CLIENT_SECRET = integrationsConfig.notion.client_secret
        this.NOTION_REDIRECT_URI = integrationsConfig.notion.redirection_url

        this.WEBFLOW_BASE_URL = integrationsConfig.webflow.base_url
        this.WEBFLOW_AUTH_URL = integrationsConfig.webflow.auth_url
        this.WEBFLOW_CLIENT_ID = integrationsConfig.webflow.client_id
        this.WEBFLOW_CLIENT_SECRET = integrationsConfig.webflow.client_secret
        this.WEBFLOW_REDIRECT_URI = integrationsConfig.webflow.redirection_url

        this.SHOPIFY_BASE_URL = integrationsConfig.shopify.base_url
        this.SHOPIFY_CLIENT_ID = integrationsConfig.shopify.client_id
        this.SHOPIFY_CLIENT_SECRET = integrationsConfig.shopify.client_secret
        this.SHOPIFY_SCOPE = integrationsConfig.shopify.scope
        this.SHOPIFY_REDIRECT_URI = integrationsConfig.shopify.redirection_url

        this.auth_integration = this.auth_integration.bind(this)

        this.linkedin_auth_callback = this.linkedin_auth_callback.bind(this)
        this.wordpressorg_auth_callback = this.wordpressorg_auth_callback.bind(this)
        this.notion_auth_callback = this.notion_auth_callback.bind(this)
        this.shopify_auth_callback = this.shopify_auth_callback.bind(this)
        this.webflow_auth_callback = this.webflow_auth_callback.bind(this)
        this.update_integration = this.update_integration.bind(this)
        this.delete_connection = this.delete_connection.bind(this)

    }

    async get_connections(req, res) {

        try {

            const { org_id, user_id, user_name, user_email } = req

            const COLUMNS = 'id,name,`key`,status,details,user_preference,last_synced'

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
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'auth_integration', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            let { app, details } = req.query

            details = JSON.parse(details || "{}")


            const get_linkedin_auth_url = (state) => {

                const BASE_URL = this.LINKEDIN_BASE_URL;
                const CLIENT_ID = this.LINKEDIN_CLIENT_ID;
                const SCOPE = this.LINKEDIN_SCOPE;
                const REDIRECT_URI = this.LINKEDIN_REDIRECT_URI;
                const RESPONSE_TYPE = 'code';
                const STATE = state;


                return `${BASE_URL}/authorization?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}`;

            }
            const get_wordpress_auth_url = (state) => {

                const BASE_URL = this.WORDPRESS_AUTH_URL;
                const CLIENT_ID = this.WORDPRESS_CLIENT_ID;
                const SCOPE = this.WORDPRESS_SCOPE;
                const REDIRECT_URI = this.WORDPRESS_REDIRECT_URI;
                const RESPONSE_TYPE = 'code';
                const STATE = state;

                return `${BASE_URL}/authorize?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}`;

            }
            const get_notion_auth_url = (state) => {

                const BASE_URL = this.NOTION_BASE_URL;
                const CLIENT_ID = this.NOTION_CLIENT_ID;
                const REDIRECT_URI = this.NOTION_REDIRECT_URI;
                const RESPONSE_TYPE = 'code';
                const STATE = state;

                return `${BASE_URL}/oauth/authorize?owner=user&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&state=${STATE}`;

            }
            const get_webflow_auth_url = (state) => {

                const BASE_URL = this.WEBFLOW_BASE_URL;
                const CLIENT_ID = this.WEBFLOW_CLIENT_ID;
                const REDIRECT_URI = this.WEBFLOW_REDIRECT_URI;
                const RESPONSE_TYPE = 'code';
                const STATE = state;
                const SCOPE = [
                    "authorized_user:read",
                    "sites:read",
                    "sites:write",
                    "pages:read",
                    "pages:write",
                    "cms:read",
                    "cms:write"
                ].join(' ');

                return `${BASE_URL}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&state=${STATE}&scope=${encodeURIComponent(SCOPE)}`;

            }
            const get_shopify_auth_url = (state, details) => {

                const store_name = details.store_name
                if (!store_name) return null

                const BASE_URL = `https://${store_name}.myshopify.com/admin`
                const CLIENT_ID = this.SHOPIFY_CLIENT_ID;
                const REDIRECT_URI = this.SHOPIFY_REDIRECT_URI;
                const SCOPE = this.SHOPIFY_SCOPE || "read_products,write_products"
                const STATE = state;

                return `${BASE_URL}/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${STATE}`;

            }

            if (app == 'linkedin') {

                const auth_url = get_linkedin_auth_url(org_id)

                return responseHandler.successRequest({
                    name: 'auth_integration',
                    req, res,
                    message: "LinkedIn connected successfully!",
                    data: {
                        auth_url
                    },
                })
            }
            else if (app == 'wordpress.org') {

                const auth_url = get_wordpress_auth_url(org_id)

                return responseHandler.successRequest({
                    name: 'auth_integration',
                    req, res,
                    message: "Wordpress.Org connected successfully!",
                    data: {
                        auth_url
                    },
                })
            }
            else if (app == 'notion') {

                const auth_url = get_notion_auth_url(org_id)

                return responseHandler.successRequest({
                    name: 'auth_integration',
                    req, res,
                    message: "Notion connected successfully!",
                    data: {
                        auth_url
                    },
                })
            }
            else if (app == 'webflow') {

                const auth_url = get_webflow_auth_url(org_id)

                return responseHandler.successRequest({
                    name: 'auth_integration',
                    req, res,
                    message: "Webflow connected successfully!",
                    data: {
                        auth_url
                    },
                })
            }
            else if (app == 'shopify') {

                const auth_url = get_shopify_auth_url(org_id, details)

                return responseHandler.successRequest({
                    name: 'auth_integration',
                    req, res,
                    message: "Shopify connected successfully!",
                    data: {
                        auth_url
                    },
                })
            }
            else if (app == 'wordpress') {

                let { site_url, username, password } = details

                const validation = Utils.validateWordpressInputs(details)


                if (!validation) {
                    return responseHandler.serverError({
                        name: 'auth_integration',
                        req, res,
                        message: "Invalid input parameters"
                    })
                }

                const normalizedUrl = Utils.normalizeUrl(site_url)

                const results = await Promise.allSettled([
                    Utils.checkWordpressSiteReachability(normalizedUrl),
                    Utils.checkWordPressAPI(normalizedUrl),
                    Utils.authenticateWordpressUser(normalizedUrl, username, password)
                ]);


                const [reachabilityResult, apiResult, authResult] = results;


                const allTestsPassed = [reachabilityResult, apiResult, authResult]
                    .every(result => result.status === 'fulfilled' && result.value.success);

                if (!allTestsPassed) return responseHandler.serverError({
                    name: 'auth_integration',
                    req, res,
                    message: Utils.getWordpressFailureMessage(all_tests)
                })

                const user_details = authResult.value.userInfo;

                const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'SELECT',
                    SELECT: 'id',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    VALID: {
                        '`key`': 'wordpress',
                        org_id: org_id
                    }
                })

                let check_platform_response = await runPreparedQuery(check_platform_query.query, check_platform_query.value)

                if (check_platform_response.length) {

                    const { id } = check_platform_response[0]

                    const query_data = {
                        status: '1',
                        details: JSON.stringify({ ...details, ...user_details }),
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

                    await runPreparedQuery(update_query.query, update_query.value)

                }
                else {
                    const query_data = {
                        org_id: org_id,
                        name: 'Wordpress',
                        '`key`': 'wordpress',
                        status: '1',
                        auth_type: 'auth',
                        details: JSON.stringify({ ...details, ...user_details }),

                        last_synced: Utils.getCurrentTimeStamp(),

                        created_by_id: user_id,
                        created_by_name: user_name || user_email,
                    }

                    const insert_query = FieldsUpdate.prepareQueryGeneratore({
                        METHOD: 'INSERT',
                        TABEL: mysqlTables.BLOG_PLATFORMS,
                        DATA: query_data
                    })

                    await runPreparedQuery(insert_query.query, insert_query.value)
                }


                return responseHandler.successRequest({
                    name: 'auth_integration',
                    req, res,
                    message: "Worpress connected successfully!",
                })
            }
            else if (app == 'ghost') {

                let { api_url, api_key } = details

                const validation = Utils.validateGhostInputs(details)


                if (!validation) return responseHandler.serverError({
                    name: 'auth_integration',
                    req, res,
                    message: "Invalid input parameters"
                })

                const normalizedUrl = Utils.normalizeUrl(api_url)

                const access_token = Utils.generateGhostAdminToken(api_key)

                const ghost = axios.create({
                    baseURL: `${normalizedUrl}/ghost/api/admin/`,
                    headers: {
                        Authorization: `Ghost ${access_token}`,
                    },
                });

                const users_response = await ghost.get('users');
                const tags_response = await ghost.get('tags');
                const site_response = await ghost.get('site');

                if (
                    users_response.status != 200
                    || tags_response.status != 200
                    || site_response.status != 200
                ) return responseHandler.serverError({
                    name: 'auth_integration',
                    req, res,
                    message: "Failed to get Ghost details, Please re-try again!"
                })

                let users = users_response?.data?.users || []
                let tags = tags_response?.data?.tags || []
                let site = site_response?.data?.site || {}

                users = users?.filter(u => u.status == 'active').map(u => {
                    return {
                        id: u.id,
                        name: u.name,
                        slug: u.slug,
                        email: u.email,
                        url: u.url,
                        profile_image: u.profile_image,
                    }
                })

                tags = tags?.map(u => {
                    return {
                        id: u.id,
                        name: u.name,
                        slug: u.slug,
                        visibility: u.visibility,
                        url: u.url,
                    }
                })

                const ghot_details = { users, tags, site }

                const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'SELECT',
                    SELECT: 'id',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    VALID: {
                        '`key`': 'ghost',
                        org_id: org_id
                    }
                })

                let check_platform_response = await runPreparedQuery(check_platform_query.query, check_platform_query.value)

                if (check_platform_response.length) {

                    const { id } = check_platform_response[0]

                    const query_data = {
                        status: '1',
                        api_url: api_url,
                        api_key: api_key,
                        details: JSON.stringify(ghot_details),

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

                    await runPreparedQuery(update_query.query, update_query.value)

                }
                else {
                    const query_data = {
                        org_id: org_id,
                        name: 'Ghost',
                        '`key`': 'ghost',
                        status: '1',
                        auth_type: 'api_key',
                        api_url: api_url,
                        api_key: api_key,
                        details: JSON.stringify(ghot_details),

                        last_synced: Utils.getCurrentTimeStamp(),

                        created_by_id: user_id,
                        created_by_name: user_name || user_email,
                    }

                    const insert_query = FieldsUpdate.prepareQueryGeneratore({
                        METHOD: 'INSERT',
                        TABEL: mysqlTables.BLOG_PLATFORMS,
                        DATA: query_data
                    })

                    await runPreparedQuery(insert_query.query, insert_query.value)
                }

                return responseHandler.successRequest({
                    name: 'auth_integration',
                    req, res,
                    message: "Worpress connected successfully!",
                    data: ghot_details,

                })
            }

        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'auth_integration', req, res })
        }

    }
    async update_integration(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'update_integration', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name, user_email } = req
            let { app, details } = req.body

            if (app == 'ghost') {


                const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'SELECT',
                    SELECT: 'id',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    VALID: {
                        '`key`': 'ghost',
                        org_id: org_id
                    }
                })

                let check_platform_response = await runPreparedQuery(check_platform_query.query, check_platform_query.value)

                if (!check_platform_response.length) return responseHandler.failedRequest({
                    name: 'delete_connection',
                    req, res,
                    message: "Ghost connected properly, Please try again!"
                })

                const { id } = check_platform_response[0]

                const query_data = {

                    user_preference: JSON.stringify(details || '{}'),

                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }

                const update_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'UPDATE',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    DATA: query_data,
                    VALID: { id }
                })

                await runPreparedQuery(update_query.query, update_query.value)

                return responseHandler.successRequest({
                    name: 'update_integration',
                    req, res,
                    message: "Ghost details updated successfully!",

                })
            }
            else if (app == 'webflow') {


                const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'SELECT',
                    SELECT: 'id',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    VALID: {
                        '`key`': 'webflow',
                        org_id: org_id
                    }
                })

                let check_platform_response = await runPreparedQuery(check_platform_query.query, check_platform_query.value)

                if (!check_platform_response.length) return responseHandler.failedRequest({
                    name: 'delete_connection',
                    req, res,
                    message: "Webflow connected properly, Please try again!"
                })

                const { id } = check_platform_response[0]

                const query_data = {

                    user_preference: JSON.stringify(details || '{}'),

                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }

                const update_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'UPDATE',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    DATA: query_data,
                    VALID: { id }
                })

                await runPreparedQuery(update_query.query, update_query.value)

                return responseHandler.successRequest({
                    name: 'update_integration',
                    req, res,
                    message: "Webflow details updated successfully!",

                })
            }
            else if (app == 'wordpress.org') {


                const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'SELECT',
                    SELECT: 'id',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    VALID: {
                        '`key`': 'wordpress.org',
                        org_id: org_id
                    }
                })

                let check_platform_response = await runPreparedQuery(check_platform_query.query, check_platform_query.value)

                if (!check_platform_response.length) return responseHandler.failedRequest({
                    name: 'delete_connection',
                    req, res,
                    message: "Wordpress Org connected properly, Please try again!"
                })

                const { id } = check_platform_response[0]

                const query_data = {

                    user_preference: JSON.stringify(details || '{}'),

                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }

                const update_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'UPDATE',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    DATA: query_data,
                    VALID: { id }
                })

                await runPreparedQuery(update_query.query, update_query.value)

                return responseHandler.successRequest({
                    name: 'update_integration',
                    req, res,
                    message: "Wordpress Org details updated successfully!",

                })
            }
            else if (app == 'notion') {


                const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'SELECT',
                    SELECT: '*',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    VALID: {
                        '`key`': 'notion',
                        org_id: org_id
                    }
                })

                let check_platform_response = await runPreparedQuery(check_platform_query.query, check_platform_query.value)

                if (!check_platform_response.length) return responseHandler.failedRequest({
                    name: 'delete_connection',
                    req, res,
                    message: "Notion connected properly, Please try again!"
                })

                const { id, oauth_token } = check_platform_response[0]


                const page_id = details['page']
                let database_details = {}
                const BASE_URL = this.NOTION_BASE_URL;

                let databases_res = await axios.post(`${BASE_URL}/databases`,
                    {
                        "parent": {
                            "type": "page_id",
                            "page_id": page_id
                        },
                        "title": [
                            {
                                "type": "text",
                                "text": {
                                    "content": "AiSEOWrite Contents",
                                    "link": null
                                }
                            }
                        ],
                        "properties": {
                            "Name": {
                                "title": {}
                            },
                            "Status": {
                                "select": {
                                    "options": [
                                        {
                                            "name": "draft",
                                            "color": "default"
                                        },
                                        {
                                            "name": "published",
                                            "color": "green"
                                        },
                                        {
                                            "name": "scheduled",
                                            "color": "yellow"
                                        }
                                    ]
                                }
                            },
                            "Created at": {
                                "date": {}
                            },
                        }
                    },
                    {
                        headers: {
                            'Accept': "application/json",
                            "Content-Type": "application/json",
                            "Notion-Version": "2022-06-28",
                            'Authorization': `Bearer ${oauth_token}`,
                        }
                    }
                )

                if (databases_res.status == 200) {
                    database_details['id'] = databases_res.data.id
                    database_details['url'] = databases_res.data.url
                }

                details['database'] = database_details

                const query_data = {

                    user_preference: JSON.stringify(details || '{}'),

                    updated_by_id: user_id,
                    updated_by_name: user_name || user_email,
                }

                const update_query = FieldsUpdate.prepareQueryGeneratore({
                    METHOD: 'UPDATE',
                    TABEL: mysqlTables.BLOG_PLATFORMS,
                    DATA: query_data,
                    VALID: { id }
                })

                await runPreparedQuery(update_query.query, update_query.value)

                return responseHandler.successRequest({
                    name: 'update_integration',
                    req, res,
                    message: "Notion details updated successfully!",

                })
            }

            return responseHandler.successRequest({
                name: 'update_integration',
                req, res,
                message: "Details updated successfully!",

            })

        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'auth_integration', req, res })
        }

    }
    async linkedin_auth_callback(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'linkedin_auth_callback', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

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
    async wordpressorg_auth_callback(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'wordpressorg_auth_callback', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

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

            const AUTH_URL = this.WORDPRESS_AUTH_URL;
            const BASE_URL = this.WORDPRESS_BASE_URL;
            const CLIENT_ID = this.WORDPRESS_CLIENT_ID;
            const CLIENT_SECRET = this.WORDPRESS_CLIENT_SECRET;
            const REDIRECT_URI = this.WORDPRESS_REDIRECT_URI;

            const payload = qs.stringify({
                grant_type: 'authorization_code',
                code: String(code),
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI
            });

            const token_res = await axios.post(`${AUTH_URL}/token`, payload,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )

            const { access_token, token_type, scope } = token_res.data;
            const expires_in = 14 * 24 * 60 * 60;

            if (!access_token) {
                return Utils.close_windows(res)
            }


            const sites_response = await axios.get(`${BASE_URL}/me/sites`,
                {
                    headers: {
                        "Authorization": `Bearer ${access_token}`,
                    }
                }
            )

            let site_details = sites_response.status == 200 ? sites_response.data['sites'] || [] : []

            site_details = site_details?.map(site => {

                return {
                    "id": site['ID'],
                    "url": site['URL'],
                    "language": site['lang'],
                    "name": site['name'],
                    "slug": site['slug'],
                    "logo": site['logo'] ? site['logo']['url'] : "",
                }
            })

            const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: 'id',
                TABEL: mysqlTables.BLOG_PLATFORMS,
                VALID: {
                    '`key`': 'wordpress.org',
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

                    details: JSON.stringify(site_details || "[]"),

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
                    name: 'Wordpress Org',
                    '`key`': 'wordpress.org',
                    status: '1',
                    auth_type: 'oauth',
                    oauth_token: access_token,

                    details: JSON.stringify(site_details || "[]"),

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
            return responseHandler.serverError({ name: 'wordpressorg_auth_callback', req, res })
        }

    }
    async notion_auth_callback(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'notion_auth_callback', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

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


            const BASE_URL = this.NOTION_BASE_URL;
            const CLIENT_ID = this.NOTION_CLIENT_ID;
            const CLIENT_SECRET = this.NOTION_CLIENT_SECRET;
            const REDIRECT_URI = this.NOTION_REDIRECT_URI;

            const Authorization_Token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

            const payload = {
                grant_type: 'authorization_code',
                code: String(code),
                redirect_uri: REDIRECT_URI
            }

            const token_res = await axios.post(`${BASE_URL}/oauth/token`, payload,
                {
                    headers: {
                        'Accept': "application/json",
                        "Content-Type": "application/json",
                        'Authorization': `Basic ${Authorization_Token}`,
                    }
                }
            )

            const { access_token, bot_id, owner, workspace_icon, workspace_id, workspace_name } = token_res.data;
            const expires_in = 14 * 24 * 60 * 60;


            const pages_res = await axios.post(`${BASE_URL}/search`,
                {
                    "filter": {
                        "property": "object",
                        "value": "page"
                    }
                },
                {
                    headers: {
                        'Accept': "application/json",
                        "Content-Type": "application/json",
                        "Notion-Version": "2022-06-28",
                        'Authorization': `Bearer ${access_token}`,
                    }
                }
            )


            let pages = pages_res.status == 200 ? pages_res.data['results'] || [] : []

            console.log(JSON.stringify(pages), 'pages_res');


            pages = pages?.map(page => {

                let properties = Object.keys(page['properties'])
                let title = page['properties'][properties[0]][page['properties'][properties[0]]['id']][0]['plain_text']

                return {
                    "id": page['id'],
                    "url": page['url'],
                    "title": title
                }
            })

            const details = {
                bot_id: bot_id,
                owner,
                workspace_icon,
                workspace_id,
                pages,
                workspace_name
            }

            if (!access_token) {
                return Utils.close_windows(res)
            }

            const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: 'id',
                TABEL: mysqlTables.BLOG_PLATFORMS,
                VALID: {
                    '`key`': 'notion',
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

                    details: JSON.stringify(details || {}),

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
                    name: 'Notion',
                    '`key`': 'notion',
                    status: '1',
                    auth_type: 'oauth',
                    oauth_token: access_token,

                    details: JSON.stringify(details || {}),

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
            return responseHandler.serverError({ name: 'notion_auth_callback', req, res })
        }

    }
    async webflow_auth_callback(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'webflow_auth_callback', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

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

            const AUTH_URL = this.WEBFLOW_AUTH_URL;
            const CLIENT_ID = this.WEBFLOW_CLIENT_ID;
            const CLIENT_SECRET = this.WEBFLOW_CLIENT_SECRET;
            const REDIRECT_URI = this.WEBFLOW_REDIRECT_URI;

            const payload = {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: String(code),
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI
            }

            const token_res = await axios.post(`${AUTH_URL}/oauth/access_token`, payload)

            const { access_token, token_type, scope } = token_res.data;
            const expires_in = 14 * 24 * 60 * 60;

            if (!access_token) return Utils.close_windows(res)

            const webflow = axios.create({
                baseURL: `${AUTH_URL}`,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'accept-version': '1.0.0',
                },
            });

            const sites_response = await webflow.get('/v2/sites');

            let sites = sites_response?.data?.sites || []

            const get_collections = async (site_id) => {
                const collections_response = await webflow.get(`/v2/sites/${site_id}/collections`);
                let collections = collections_response?.data?.collections || []

                collections = collections.map(c => {
                    c.site_id = site_id
                    return c
                })

                return collections
            }

            const get_collection_schemas = async (cms_id) => {
                const response = await webflow.get(`/v2/collections/${cms_id}`);
                return response?.data || {}
            }

            const collectionsPromises = sites.map(async (site) => await get_collections(site.id));

            let collections = await Promise.all(collectionsPromises);
            collections = collections.flat()

            const collectionsSchemaPromises = collections.map(async (cms) => await get_collection_schemas(cms.id));
            let collectionsSchemas = await Promise.all(collectionsSchemaPromises);

            const details = {
                sites: sites,
                collections: collections,
                collectionsSchemas: collectionsSchemas
            }

            const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: 'id',
                TABEL: mysqlTables.BLOG_PLATFORMS,
                VALID: {
                    '`key`': 'webflow',
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

                    details: JSON.stringify(details || {}),

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

                await runPreparedQuery(update_query.query, update_query.value)

            }
            else {
                const query_data = {
                    org_id: state,
                    name: 'Webflow',
                    '`key`': 'webflow',
                    status: '1',
                    auth_type: 'oauth',
                    oauth_token: access_token,

                    details: JSON.stringify(details || {}),

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

                await runPreparedQuery(insert_query.query, insert_query.value)
            }

            return Utils.close_windows(res)
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'webflow_auth_callback', req, res })
        }

    }
    async shopify_auth_callback(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'shopify_auth_callback', req, res, payload: req.query })
            if (isPayloadInvalid) return isPayloadInvalid

            const { code, state, shop, hmac, timestamp, host } = req.query

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


            const BASE_URL = this.NOTION_BASE_URL;
            const CLIENT_ID = this.NOTION_CLIENT_ID;
            const CLIENT_SECRET = this.NOTION_CLIENT_SECRET;
            const REDIRECT_URI = this.NOTION_REDIRECT_URI;

            const Authorization_Token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

            const payload = {
                grant_type: 'authorization_code',
                code: String(code),
                redirect_uri: REDIRECT_URI
            }

            const token_res = await axios.post(`${BASE_URL}/oauth/token`, payload,
                {
                    headers: {
                        'Accept': "application/json",
                        "Content-Type": "application/json",
                        'Authorization': `Basic ${Authorization_Token}`,
                    }
                }
            )

            // {
            //   access_token: 'UR5gt2LM6k$XWBvpbtCt7soLgq(ROZIzMpT%5RZvH9Axg!qAHf^EDvLlBFy255Y*',
            //   token_type: 'bearer',
            //   blog_id: '0',
            //   blog_url: null,
            //   scope: 'global'
            // }

            const { access_token, bot_id, owner, workspace_icon, workspace_id, workspace_name } = token_res.data;
            const expires_in = 14 * 24 * 60 * 60;

            const details = {
                bot_id: bot_id,
                owner,
                workspace_icon,
                workspace_id,
                workspace_name
            }

            if (!access_token) {
                return Utils.close_windows(res)
            }

            const check_platform_query = FieldsUpdate.prepareQueryGeneratore({
                METHOD: 'SELECT',
                SELECT: 'id',
                TABEL: mysqlTables.BLOG_PLATFORMS,
                VALID: {
                    '`key`': 'shopify',
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

                    details: JSON.stringify(details || {}),

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
                    name: 'Notion',
                    '`key`': 'shopify',
                    status: '1',
                    auth_type: 'oauth',
                    oauth_token: access_token,

                    details: JSON.stringify(details || {}),

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
            return responseHandler.serverError({ name: 'shopify_auth_callback', req, res })
        }

    }


    async delete_connection(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'delete_connection', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

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