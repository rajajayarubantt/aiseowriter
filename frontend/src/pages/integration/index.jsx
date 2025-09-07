import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Cards from '../../components/Cards'
import { PageContainer, PageHeader } from '../../components/Page'

/* Sub Pages */

/*Helpers*/
import Utils from "../../helpers/utils";
import dayjs from 'dayjs';

import ConnectWordpress from './ConnectWordpress'
import ConnectWebhook from './ConnectWebhook'
import ConnectShopify from './ConnectShopify'
import ConnectGhost from './ConnectGhost'
import UpdateGhostDetails from './UpdateGhostDetails'
import UpdateWebflowDetails from './UpdateWebflowDetails'
import UpdateWordpressDetails from './UpdateWordpressDetails'
import UpdateNotionDetails from './UpdateNotionDetails'

/*handler*/
import IntegrationHandler from '../../handlers/integration/integration'


const Index = () => {

    const PAGE_ID = "integration"

    const navigator = useNavigate()
    const integrationHandler = new IntegrationHandler()

    const PAGE_TITLE = "All Integrations"
    const PAGE_DESC = "Boost your blog automation with seamless platform integration for effortless content management."


    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [ShowConntetWordpress, setShowConntetWordpress] = useState(false)
    const [ShowConntetShopify, setShowConntetShopify] = useState(false)
    const [ShowConntetGhost, setShowConntetGhost] = useState(false)
    const [ShowUpdateGhostDetails, setShowUpdateGhostDetails] = useState(false)
    const [ShowUpdateWebflowDetails, setShowUpdateWebflowDetails] = useState(false)
    const [ShowUpdateWordpressDetails, setShowUpdateWordpressDetails] = useState(false)
    const [ShowUpdateNotionDetails, setShowUpdateNotionDetails] = useState(false)
    const [ShowConnectWebhook, setShowConnectWebhook] = useState(false)

    const [GhostDetails, setGhostDetails] = useState(undefined)
    const [WebflowDetails, setWebflowDetails] = useState(undefined)
    const [WordpressDetails, setWordpressDetails] = useState(undefined)
    const [NotionDetails, setNotionDetails] = useState(undefined)

    const [Apps, setApps] = useState([
        {
            id: 'linkedin',
            img: Images.apps.Linkedin,
            name: 'LinkedIn',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'ghost',
            img: Images.apps.Ghost,
            name: 'Ghost',
            desc: `Seamlessly integrate your AI articles with Ghost’s blogging platform.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'wordpress',
            img: Images.apps.Wordpress,
            name: 'Wordpress',
            desc: `Instantly publish to WordPress.com with our integration.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'wordpress.org',
            img: Images.apps.Wordpress_org,
            name: 'Wordpress Org',
            desc: `Easily connect and push content to your WordPress.org site.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'notion',
            img: Images.apps.Notion,
            name: 'Notion',
            desc: `Publish AI-generated articles directly to your Notion workspace.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'webflow',
            img: Images.apps.Webflow,
            name: 'Webflow',
            desc: `Streamline your content flow into Webflow with one click.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'webhook',
            img: Images.apps.Webhook,
            name: 'Webhook',
            desc: `Streamline your content flow into Webhook with one click.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'twitter',
            img: Images.apps.Twitter,
            name: 'X (Twitter)',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            coming_soon: true,
            has_settings: true,
        },
        {
            id: 'instagram',
            img: Images.apps.Instagram,
            name: 'Instagram',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
            coming_soon: true,
        },
        {
            id: 'shopify',
            img: Images.apps.Shopify,
            name: 'Shopify',
            desc: `Automate publishing on your Shopify page with our direct connection.`,
            has_connected: false,
            has_settings: true,
            coming_soon: true,
        },

        {
            id: 'blogger',
            img: Images.apps.Blogger,
            name: 'Blogger',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
            coming_soon: true,
        },
        {
            id: 'zapier',
            img: Images.apps.Zapier,
            name: 'Zapier',
            desc: `Integrate with Zapier to connect AiSEoWrite with thousands of apps.`,
            has_connected: false,
            has_settings: true,
            coming_soon: true,
        },

    ])

    const connectApp = async (app) => {

        if (!app) return
        let payload = {
            app: app
        }

        setIsLoading(true)
        let response = await integrationHandler.auth(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)
            return
        }

        let { auth_url } = response.data

        if (!auth_url) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage('Failed to connect, Please try again')
            return
        }

        if (app == 'linkedin') {

            const popup = window.open(
                auth_url,
                "LinkedInAuth",
                "width=600,height=700"
            );

            const timer = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(timer);

                    getAppConnections()
                }
            }, 1000);
        }
        else if (app == 'wordpress.org') {

            const popup = window.open(
                auth_url,
                "WordpressAuth",
                "width=600,height=700"
            );

            const timer = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(timer);

                    getAppConnections()
                }
            }, 1000);
        }
        else if (app == 'notion') {

            const popup = window.open(
                auth_url,
                "NotionAuth",
                "width=600,height=700"
            );

            const timer = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(timer);

                    getAppConnections()
                }
            }, 1000);
        }
        else if (app == 'webflow') {

            const popup = window.open(
                auth_url,
                "WebflowAuth",
                "width=600,height=700"
            );

            const timer = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(timer);

                    getAppConnections()
                }
            }, 1000);
        }


    }

    const triggerConnectWordpress = () => setShowConntetWordpress(true)
    const triggerConnectShopify = () => setShowConntetShopify(true)
    const triggerConnectGhost = () => setShowConntetGhost(true)
    const triggerConnectWebhook = () => setShowConnectWebhook(true)
    const triggerUpdateGhostDetails = () => setShowUpdateGhostDetails(true)
    const triggerUpdateWebflowDetails = () => setShowUpdateWebflowDetails(true)
    const triggerUpdateWordpressDetails = () => setShowUpdateWordpressDetails(true)
    const triggerUpdateNotionDetails = () => setShowUpdateNotionDetails(true)

    const connectWordpress = async (params) => {

        if (!params) return setShowConntetWordpress(false)

        let payload = {
            app: 'wordpress',
            details: JSON.stringify(params)
        }

        setIsLoading(true)
        let response = await integrationHandler.auth(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)
            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage(response.message)

        setShowConntetWordpress(false)
        getAppConnections()

    }

    const connectGhost = async (params) => {

        if (!params) return setShowConntetGhost(false)

        let payload = {
            app: 'ghost',
            details: JSON.stringify(params)
        }

        setIsLoading(true)
        let response = await integrationHandler.auth(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)
            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage(response.message)

        setShowConntetGhost(false)
        triggerUpdateGhostDetails(true)
        setGhostDetails(response.data)



    }
    const connectShopify = async (params) => {

        if (!params) return setShowConntetShopify(false)

        let payload = {
            app: 'shopify',
            details: JSON.stringify(params)
        }

        setIsLoading(true)
        let response = await integrationHandler.auth(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)
            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage(response.message)

        setShowConntetShopify(false)

        let { auth_url } = response.data

        if (!auth_url) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage('Failed to connect, Please try again')
            return
        }


        const popup = window.open(
            auth_url,
            "ShopifyAuth",
            "width=600,height=700"
        );

        const timer = setInterval(() => {
            if (popup?.closed) {
                clearInterval(timer);

                getAppConnections()
            }
        }, 1000);

    }

    const updateDetails = async (app, params) => {

        if (!app || !params) {
            setShowConntetGhost(false)
            setShowUpdateWebflowDetails(false)
            setShowConnectWebhook(false)
            return
        }

        let payload = {
            app: app,
            details: params
        }

        setIsLoading(true)
        let response = await integrationHandler.update(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)
            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage(response.message)

        setShowUpdateGhostDetails(false)
        setShowUpdateWebflowDetails(false)
        setShowUpdateWordpressDetails(false)
        setShowUpdateNotionDetails(false)
        setShowConnectWebhook(false)

        getAppConnections()
    }

    const handleConnectCallback = (item) => {
        const { id, has_connected } = item;

        if (has_connected) return

        if (id == 'linkedin') connectApp('linkedin')
        if (id == 'wordpress.org') connectApp('wordpress.org')
        if (id == 'notion') connectApp('notion')
        if (id == 'webflow') connectApp('webflow')
        else if (id == 'wordpress') triggerConnectWordpress()
        else if (id == 'shopify') triggerConnectShopify()
        else if (id == 'ghost') triggerConnectGhost()
        else if (id == 'webhook') triggerConnectWebhook()
    }

    const handleDeleteConnect = async (item) => {
        const { _id, has_connected } = item;

        if (!has_connected) return

        setIsLoading(true)
        let response = await integrationHandler.delete({ id: String(_id) })
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage('Connection removed')

        getAppConnections()
    }

    const render_card = ({ id, item, idx }) => {

        return (
            <>
                <div className="card-top-main">
                    <div className="card-details">
                        <div className="details-img">
                            <img src={item.img} alt={item.id} />
                        </div>
                        <div className="details-content">
                            <div className="details-title">{item.name}</div>
                            <div className="details-desc">{item.desc}</div>
                        </div>
                    </div>

                </div>
                <div className="card-bottom-main">

                    {item.coming_soon ?
                        <div
                            className={`card-connection card-connection-coming_soon`}
                        >
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.default.spinner }}
                            ></div>
                            <div className="label">Coming soon</div>
                        </div>
                        :
                        <>
                            <div
                                className={`card-connection ${item.has_connected ? 'card-connection-done' : ''}`}
                                onClick={() => handleConnectCallback(item)}
                            >
                                <div className="icon"
                                    dangerouslySetInnerHTML={{ __html: item.has_connected ? Icons.default.tick_mark : Icons.default.connection }}
                                ></div>
                                <div className="label">{item.has_connected ? 'Connected' : 'Connect Now'}</div>
                            </div>
                            <div className="card-actions">
                                {(item.has_connected && item.last_synced) && <div className="card-time">{item.last_synced}</div>}
                                {item.has_connected &&
                                    <div
                                        className="card-icon"
                                        dangerouslySetInnerHTML={{ __html: Icons.default.disconnect }}
                                        onClick={() => handleDeleteConnect(item)}
                                        title="Disconnect"
                                    ></div>
                                }
                                {/* <div className="card-icon" dangerouslySetInnerHTML={{ __html: Icons.default.info }}></div> */}
                            </div>
                        </>
                    }

                </div>
            </>
        )
    }

    const getAppConnections = async (filters = {}) => {


        setIsLoading(true)
        let response = await integrationHandler.get(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let connections = response.data || []

        let app_connections = [...Apps].map((app, idx) => {

            let connection = connections.find(c => c.key == app.id)

            if (connection) {
                app._id = connection.id
                app.last_synced = Utils.formateDateLabel({ ms: connection.last_synced })
                app.has_connected = connection.status == 'Connected'
            }
            else {
                delete app._id
                delete app.last_synced
                app.has_connected = false
            }

            return app

        })

        let webflow_connection = connections.find(c => c.key == 'webflow')
        let wordpress_org = connections.find(c => c.key == 'wordpress.org')
        let notion = connections.find(c => c.key == 'notion')

        if (webflow_connection && webflow_connection.details && webflow_connection.status == 'Connected' && !webflow_connection.user_preference) {
            triggerUpdateWebflowDetails()
            setWebflowDetails(webflow_connection.details)
        }

        if (wordpress_org && wordpress_org.details && wordpress_org.status == 'Connected' && !wordpress_org.user_preference) {
            triggerUpdateWordpressDetails()
            setWordpressDetails(wordpress_org.details)
        }
        if (notion && notion.details && notion.status == 'Connected' && !notion.user_preference) {
            triggerUpdateNotionDetails()
            setNotionDetails(notion.details)
        }


        setApps(app_connections)


    }
    useEffect(() => {
        getAppConnections()
    }, [])

    return (
        <>
            {isLoading ?

                <Loaders
                    props={{
                        isLabel: true
                    }} />
                : null}
            {warningAlert ?

                <Toasters
                    props={{
                        type: warningAlertType,
                        message: warningAlertMessage,
                        callback: (confirmation) => setWarningAlert(false)
                    }} />
                : null}

            {ShowConntetWordpress && <ConnectWordpress callback={connectWordpress} />}
            {ShowConnectWebhook && <ConnectWebhook callback={(v) => updateDetails('webhook', v)} />}
            {ShowConntetShopify && <ConnectShopify callback={connectShopify} />}
            {ShowConntetGhost && <ConnectGhost callback={connectGhost} />}
            {ShowUpdateGhostDetails && <UpdateGhostDetails details={GhostDetails} callback={(v) => updateDetails('ghost', v)} />}
            {ShowUpdateWebflowDetails && <UpdateWebflowDetails details={WebflowDetails} callback={(v) => updateDetails('webflow', v)} />}
            {ShowUpdateWordpressDetails && <UpdateWordpressDetails details={WordpressDetails} callback={(v) => updateDetails('wordpress.org', v)} />}
            {ShowUpdateNotionDetails && <UpdateNotionDetails details={NotionDetails} callback={(v) => updateDetails('notion', v)} />}

            <PageContainer id={PAGE_ID}>
                <PageHeader
                    id={PAGE_ID}
                    title={PAGE_TITLE}
                    desc={PAGE_DESC}
                    actions={[]}
                />

                <Cards
                    id={PAGE_ID}
                    card_style={{
                        maxWidth: 'var(--page-card-mid-width)',
                        height: 'var(--page-card-mid-height)'
                    }}
                    cards={Apps}
                    render_card={render_card}
                />

            </PageContainer>
        </>
    );
};

export default Index;
