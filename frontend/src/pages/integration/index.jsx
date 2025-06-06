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
            id: 'zapier',
            img: Images.apps.Zapier,
            name: 'Zapier',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'twitter',
            img: Images.apps.Twitter,
            name: 'X (Twitter)',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'instagram',
            img: Images.apps.Instagram,
            name: 'Instagram',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'shopify',
            img: Images.apps.Shopify,
            name: 'Shopify',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'webflow',
            img: Images.apps.Webflow,
            name: 'Webflow',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'wordpress',
            img: Images.apps.Wordpress,
            name: 'Wordpress',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'ghost',
            img: Images.apps.Ghost,
            name: 'Ghost',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'blogger',
            img: Images.apps.Blogger,
            name: 'Blogger',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'notion',
            img: Images.apps.Notion,
            name: 'Notion',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },

    ])

    const connectLinkedIn = async () => {

        let payload = {
            app: 'linkedin'
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
        }

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

    const handleConnectCallback = (item) => {
        const { id, has_connected } = item;

        if (has_connected) return

        if (id == 'linkedin') connectLinkedIn()
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
                        {(item.has_connected && item.last_synced) && <div className="card-time">&#128257;{item.last_synced}</div>}
                        {item.has_connected &&
                            <div
                                className="card-icon icon-delete"
                                dangerouslySetInnerHTML={{ __html: Icons.default.delete }}
                                onClick={() => handleDeleteConnect(item)}
                            ></div>
                        }
                        {/* <div className="card-icon" dangerouslySetInnerHTML={{ __html: Icons.default.info }}></div> */}
                    </div>

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
