import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import { Popconfirm } from 'antd'
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Cards from '../../components/Cards'
import { PageContainer, PageHeader } from '../../components/Page'
import Buttons from "../../components/Buttons";

/* Sub Pages */
import AddSitemap from "./AddSitemap";
import ViewSitemap from "./ViewSitemap";

/*Helpers*/
import Utils from "../../helpers/utils";
import dayjs from 'dayjs';

/*handler*/
import SitemapHandler from '../../handlers/sitemap/sitemap'

const Index = () => {

    const PAGE_ID = "pilots"

    const navigator = useNavigate()
    const sitemapHandler = new SitemapHandler()

    const PAGE_TITLE = "Your Sitemaps"
    const PAGE_DESC = "Easily create and manage multiple sitemaps for your blog content."

    const store = useSelector(state => state)


    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [Sitemaps, setSitemaps] = useState([])
    const [HasNoLimit, setHasNoLimit] = useState(true)


    const handleAddNew = () => {
        navigator('add')
    }

    const handleRefresh = async (item) => {
        console.log(item, 'item');

        let payload = {
            id: item.id
        }
        setIsLoading(true)
        let response = await sitemapHandler.refresh(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage("Sitemap refreshed successfully")

        getSitemaps()

    }
    const handleDelete = async (item) => {
        console.log(item, 'item');

        let payload = {
            id: item.id
        }

        setIsLoading(true)
        let response = await sitemapHandler.delete(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage("Sitemap deleted successfully")

        getSitemaps()
    }

    const handleViewSitemap = (item) => {
        navigator(`view/${item.id}`)
    }

    const activateItem = async (item) => {

        let payload = {
            id: item.id
        }
        setIsLoading(true)
        let response = await sitemapHandler.activate(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage("Sitemap activated successfully")

        getSitemaps()

    }

    const render_card = ({ id, item, idx }) => {

        return (
            <>
                <div className="card-top-main">
                    <div className="card-details"
                        onClick={(e) => handleViewSitemap(item)}
                    >
                        <div className="details-img">
                            <img src={item?.meta_data?.favicon || Images.Default} alt={item.id} />
                        </div>
                        <div className="details-content">
                            <div className="details-title">{item?.meta_data?.title}</div>
                            <div className="details-desc">{item?.meta_data?.description}</div>
                        </div>
                    </div>
                    <div className="action-item">
                        <Buttons
                            type={item.status == '1' ? 'primary' : "default"}
                            width={'auto'}
                            label={item.status == '1' ? 'Active' : "Activate"}
                            callback={item.status == '1' ? () => { } : () => activateItem(item)}
                            _style={{
                                minHeight: '28px',
                                height: '28px'
                            }}
                        />

                        <div className="icon-btn"
                            onClick={(e) => handleRefresh(item)}
                            dangerouslySetInnerHTML={{ __html: Icons.default.refresh }}
                        ></div>
                        <Popconfirm
                            title={`Are you sure you want to delete this sitemap?`}
                            description={`This action cannot be undone.`}
                            onConfirm={(e) => handleDelete(item)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <div className="icon-btn"
                                dangerouslySetInnerHTML={{ __html: Icons.default.delete }}
                            ></div>

                        </Popconfirm>


                    </div>

                </div>
                <div className="card-bottom-main"
                    onClick={(e) => handleViewSitemap(item)}
                >
                    <div className="card-labels">
                        {(item.urls && item.urls.length) && <div className="card-labels-item">Total links: <strong>{item.urls.length}</strong></div>}
                        {item.sitemap_url && <div className="card-labels-item">{item.sitemap_url}</div>}
                    </div>
                </div>
            </>
        )
    }

    const getSitemaps = async () => {

        let filters = {
            columns: "_id,org_id,sitemap_url,meta_data,status,created_at,updated_at"
        }

        setIsLoading(true)
        let response = await sitemapHandler.get(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let datas = response.data || []



        setSitemaps(datas)


    }

    useEffect(() => {
        getSitemaps()
    }, [])

    useEffect(() => {

        if (store.user.subscription.limitations) setHasNoLimit(store.user.subscription.limitations.sitemap <= 0)

    }, [store.user.subscription])

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
            <Routes>
                <Route exact path={`/add`} element={<AddSitemap callback={getSitemaps} />}></Route>
                <Route exact path={`/view/:id`} element={<ViewSitemap />}></Route>
            </Routes>

            <PageContainer id={PAGE_ID}>
                <PageHeader
                    id={PAGE_ID}
                    title={PAGE_TITLE}
                    desc={PAGE_DESC}
                    actions={[
                        {
                            type: "primary",
                            icon: Icons.default.plus,
                            width: "auto",
                            label: "Add New",
                            has_no_limit: HasNoLimit,
                            callback: handleAddNew,
                        }
                    ]}
                />

                <Cards
                    id={PAGE_ID}
                    card_style={{
                        maxWidth: 'var(--page-card-full-width)',
                    }}
                    cards={Sitemaps}
                    render_card={render_card}
                />

            </PageContainer>
        </>
    );
};

export default Index;
