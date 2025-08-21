import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { Drawer, Progress, Empty } from 'antd';

/*Assets*/
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Buttons from '../../components/Buttons'
import MoreOptionsBtn from '../../components/MoreOptionsBtn'
import Stepper from "../../components/Stepper";

/*Constant Data*/
import { LanguagesData } from '../../data/data'

/*handler*/
import CampaignsHandler from '../../handlers/campaigns/campaigns'
import BrandHandler from '../../handlers/brands/brands'
import Images from "../../assets/Images";


const ViewCampaign = ({ callback = () => { } }) => {

    const { id } = useParams()

    const navigator = useNavigate()
    const campaignsHandler = new CampaignsHandler()
    const brandHandler = new BrandHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const ScheduleTimeOptions = {
        peek: 'Peek traffic 8 am (GMT)',
        moderate: 'Moderate traffic 12 pm, 3 pm (GMT)',
        normal: 'Normal traffic 6 pm, 8 pm (GMT)',
    }
    const PlatformsOptions = [...Images.integrations]

    const [InfoItems, setInfoItems] = useState([])
    const [Keywords, setKeywords] = useState([])
    const [IntegrationIncluded, setIntegrationIncluded] = useState([])
    const [Articles, setArticles] = useState([])


    const getLanguages = () => {
        return LanguagesData.map((l, idx) => {
            return {
                value: l.label,
                label: l.label,
                icon: l.icon
            };
        });
    };

    const handleClose = () => {
        if (callback) callback()
        return navigator(-1)
    }

    const getBrands = async ({ id }) => {

        if (!id) return undefined

        const filters = {
            id: id,
            columns: 'id,name,logo'
        }

        let response = await brandHandler.get(filters)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return undefined
        }

        let brand_datas = response.data || []

        return brand_datas?.map(d => {

            let brand = {
                id: d.id,
                name: d.name,
            }

            if (d.logo) brand.img = `data:image/png;base64,${d.logo}`
            else brand.icon = Icons.default.brand

            return brand
        })[0]


    }
    const getCampaign = async () => {
        const filters = {
            id: String(id),
        }

        setIsLoading(true)

        let response = await campaignsHandler.get(filters)

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let campaign = response.data[0] || undefined

        if (!campaign) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage('Please re-open campaign')

            return
        }
        const getStatus = (status) => {
            if (status == '0') {

                return {
                    status: 'In progress',
                    status_key: 'inprogress'
                }
            }
            else if (status == '1') {

                return {
                    status: 'Paused',
                    status_key: 'draft'
                }
            }
            else if (status == '2') {

                return {
                    status: 'Published',
                    status_key: 'completed'
                }
            }
            else if (status == '3') {

                return {
                    status: 'Failed',
                    status_key: 'failed'
                }
            }
            else if (status == '4') {

                return {
                    status: 'Canceled',
                    status_key: 'default'
                }
            }
        }

        const brand_details = await getBrands({ id: campaign.brand_id })
        const integrations = PlatformsOptions.filter(p => campaign.platforms.includes(p.value))
        const language = getLanguages().filter(l => l.label == (campaign.language || 'English (US)'))[0]
        const articles = campaign.articles || []
        const post_count = parseInt(campaign.post_count) || 0


        let infoItems = [
            {
                label: 'Name',
                icon: Icons.default.task,
                value: campaign.name || 'N/A'
            },
            {
                label: 'Description',
                icon: Icons.default.description,
                value: campaign.description || 'N/A'
            },
            {
                label: 'Schedule type',
                icon: Icons.default.calender,
                value: campaign.schedule_type == '1' ? campaign.schedule_type.length ? 'Custom Schedule' : ScheduleTimeOptions[campaign.time_zone] : 'Post now'
            },

            {
                label: 'Status',
                icon: Icons.default.progress,
                type: 'status',
                status_label: getStatus(campaign.status).status,
                status_key: getStatus(campaign.status).status_key
            },
            {
                label: 'Last Updated',
                icon: Icons.default.schedule,
                value: Utils.formateDateLabel({ ms: campaign.created_at, isTime: true })
            },
            {
                label: 'Published',
                icon: Icons.default.tv,
                type: 'progress',
                value: articles.length / post_count * 100,
                total: post_count
            },
            {
                label: 'Language',
                icon: Icons.default.language,
                value: language.label,
                value_icon: language.icon,
            }

        ]

        if (brand_details) {
            infoItems.push({
                label: 'Brand',
                icon: Icons.default.brand,
                value: brand_details.name,
                value_img: brand_details.img,
                value_icon: brand_details.icon,
            })
        }
        setInfoItems(infoItems)
        setKeywords(campaign.keywords)
        setIntegrationIncluded(integrations)
        setArticles(campaign.articles || [])

    }


    useEffect(() => {
        getCampaign()

    }, [])

    const renderInfoValue = ({ type, total, value, value_icon, status_label, status_key, value_img }) => {


        return (
            <div className="info-section-item-value">
                {value_icon && <div className="icon" dangerouslySetInnerHTML={{ __html: value_icon }}></div>}
                {value_img && <img className="img" src={value_img} />}
                {type == 'progress' ?
                    <Progress
                        percent={value}
                        size={{
                            width: '150px',
                            height: '6px'
                        }}
                        format={() => `1/${total}`}

                    />
                    :
                    type == 'status' ? <div className={`table-status-main table-status-${status_key || 'default'}`}>{status_label}</div> :
                        <div className="value-txt">{value}</div>}

            </div>
        )

    }


    return (
        <>

            {warningAlert ?

                <Toasters
                    props={{
                        type: warningAlertType,
                        message: warningAlertMessage,
                        callback: () => setWarningAlert(false)
                    }} />
                : null}
            {/* <PopupWrapper> */}
            <Drawer
                width={550}
                destroyOnHidden
                title={
                    <div className="custom-modal-header" style={{ padding: '0' }}>
                        <div className="modal-header-title" >
                            Campaign Info</div>
                    </div>
                }
                placement="right"
                open={true}
                loading={isLoading}
                onClose={() => handleClose()}
            >
                <div className="drawer-sections-main">
                    <div className="drawer-section ">
                        <div className="info-section-items">
                            {InfoItems?.map((item, idx) => (
                                <div
                                    key={`info-section-item-${idx}`}
                                    className="info-section-item"
                                >
                                    <div className="info-section-item-label">
                                        <div className="icon"
                                            dangerouslySetInnerHTML={{ __html: item.icon }}
                                        ></div>
                                        <div className="label-txt">{item.label}</div>
                                    </div>
                                    {renderInfoValue(item)}
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="drawer-section">
                        <div className="drawer-section-head">
                            <div className="head-title">Keywords</div>
                        </div>
                        <div className="tags-section-items">
                            {Keywords?.map((item, idx) => (
                                <div
                                    key={`tags-section-item-${idx}`}
                                    className="tags-section-item">{item}</div>
                            ))}

                        </div>
                    </div>
                    <div className="drawer-section">
                        <div className="drawer-section-head">
                            <div className="head-title">Articles({Articles.length})</div>
                            <div className="head-actions">
                                {IntegrationIncluded?.map((item, idx) => (
                                    <div
                                        key={`integration-app-${item.value}-${idx}`}
                                        className="integration-app-icon"
                                    > <img src={item.img} alt="" /></div>
                                ))}

                            </div>
                        </div>
                        <div className="cards-section-items">
                            {!Articles.length &&
                                <Empty
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    description={'No article yet'}
                                />
                            }
                            {Articles?.map((item, idx) => (
                                <Link
                                    key={`cards-section-item-${idx}`}
                                    className="cards-section-item"
                                    to={`/article/${item.id}`}
                                >
                                    <div className="cards-item-banner">
                                        <img src={item?.cover_image?.regular || Images.Default} alt="" />
                                    </div>
                                    <div className="cards-item-details">
                                        <div className="details-title">{item.title}</div>
                                    </div>
                                </Link>
                            ))}

                        </div>
                    </div>
                </div>

            </Drawer>

        </>
    )
}

export default ViewCampaign;