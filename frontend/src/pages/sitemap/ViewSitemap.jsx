import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Modal } from 'antd';

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";

/*Components*/
import InputWrapper from "../../components/Inputs/Wrapper";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Table from '../../components/Table'


/*handler*/
import SitemapHandler from '../../handlers/sitemap/sitemap'

const ViewSitemap = ({ callback = () => { } }) => {

    const { id } = useParams()

    const navigator = useNavigate()
    const sitemapHandler = new SitemapHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [SiteMap, setSiteMap] = useState({})
    const [SiteMapURLs, setSiteMapURLs] = useState([])

    const handleClose = () => {
        return navigator(-1)
    }

    const getSitemaps = async () => {

        let filters = {
            id: id
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
        datas = datas[0]

        let sitemapUrls = datas?.urls.map((url, idx) => {

            let slug = Utils.getSlugFromUrl(url)

            return {
                sno: idx + 1,
                url: url,
                slug: slug
            }
        })

        setSiteMapURLs(sitemapUrls)

        setSiteMap(datas)


    }

    const TableColumns = [
        {
            title: 'S:No',
            dataIndex: 'sno',
            key: 'sno',
            width: 50,
        },

        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        }

    ]



    useEffect(() => {

        getSitemaps()
    }, [])

    return (
        <>
            {/* {isLoading ?

                <Loaders
                    props={{
                        isLabel: true
                    }} />
                : null} */}
            {warningAlert ?

                <Toasters
                    props={{
                        type: warningAlertType,
                        message: warningAlertMessage,
                        callback: () => setWarningAlert(false)
                    }} />
                : null}
            {/* <PopupWrapper> */}
            <Modal
                title={
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}
                        >
                            {SiteMap &&
                                <img
                                    src={SiteMap?.meta_data?.favicon || Images.Default}
                                    alt="sitemap"
                                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                                />
                            }
                            {SiteMap?.meta_data?.title}</div>
                        <div
                            style={{
                                marginTop: '8px',
                                width: 'max-content',
                                background: '#f0f4f8',
                                padding: '5px',
                                borderRadius: '4px',
                                fontWeight: 'normal',
                                fontSize: '12px'
                            }}>{SiteMap?.sitemap_url}</div>

                    </div>
                }
                open={true}
                width={'800px'}
                onCancel={handleClose}
                cancelText="Discard"
                centered={true}
                maskClosable={false}
                footer={[]}
                styles={{
                    overflowY: 'auto',
                    paddingTop: '16px',
                    paddingRight: '8px',
                }}
            >

                <Table
                    has_select={false}
                    columns={TableColumns}
                    data={SiteMapURLs}
                    loading={isLoading}
                    pagination={false}
                    maxHeight={'70vh'}
                />


            </Modal>

        </>
    )
}

export default ViewSitemap;