import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { Progress } from 'antd';

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/

import ActionDropdown from "../../components/ActionDropdown";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import TopCards from '../../components/TopCards'
import Table from '../../components/Table'
import { PageContainer, PageHeader } from '../../components/Page'

/* Sub Pages */
import CreateCampaign from './CreateCampaign'
import ViewCampaign from './ViewCampaign'

/*Helpers*/
import Utils from "../../helpers/utils";

/*handler*/
import CampaignsHandler from '../../handlers/campaigns/campaigns'

const Index = () => {

    const PAGE_ID = "articles"

    const navigator = useNavigate()
    const campaignsHandler = new CampaignsHandler()

    const PAGE_TITLE = "Auto blogs"
    const PAGE_DESC = "Campaigns define how your content is generated and published. Choose between manual execution or automated scheduling with AutoBlogs."


    const [isLoading, setIsLoading] = useState(false)
    const [IsTableLoading, setIsTableLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")


    const [SummaryCards, setSummaryCards] = useState([
        {
            id: 'total_campaigns',
            type: 'total',
            label: 'Total Campaigns',
            icon: Icons.default.task,
            value: 0,
            status_key: 'all'

        },
        {
            id: 'inprogress_campaigns',
            type: 'inprogress',
            label: 'In Progress',
            icon: Icons.default.task,
            value: 0,
            status_key: '0'

        },
        {
            id: 'completed_campaigns',
            type: 'completed',
            label: 'Completed',
            icon: Icons.default.task,
            value: 0,
            status_key: '2'

        },
        {
            id: 'failed_campaigns',
            type: 'failed',
            label: 'Failed',
            icon: Icons.default.task,
            value: 0,
            status_key: '3'

        },
    ])
    const [Campaigns, setCampaigns] = useState([])


    const TableColumns = [
        {
            title: 'S:No',
            dataIndex: 'sno',
            key: 'sno',
            width: 50,
        },
        {
            title: 'Campaign',
            dataIndex: 'name',
            key: 'name',

            render: (text, record) => (
                <div
                    className="table-title-main"
                    onClick={() => openRow(record.id)}
                >
                    <div className="title-label">{text}</div>
                    {record.description && <div className="title-desc">{record.description}</div>}

                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <div className={`table-status-main table-status-${record.status_key || 'default'}`}>{text}</div>
            ),
        },
        {
            title: 'Published',
            dataIndex: 'post_count',
            key: 'post_count',
            render: (_, record) => (
                <Progress
                    percent={record.completion_percent}
                    size={{
                        width: '100px',
                        height: '5px'
                    }}
                    format={() => `${record.articles.length}/${record.post_count}`}

                />
            )
        },
        {
            title: 'Schedule type',
            dataIndex: 'schedule_type',
            key: 'schedule_type',
            render: (text) => `${text == '1' ? 'Scheduled' : 'Post now'}`
        },
        {
            title: 'Post daily',
            dataIndex: 'post_daily',
            key: 'post_daily',
            render: (text) => `${text == '1' ? 'Yes' : 'No'}`
        },
        {
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
        },
        {
            title: 'Created at',
            dataIndex: 'created_at',
            key: 'created_at',
        },


    ]
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        responsive: true,
        pageSizeOptions: ['10', '50', '100'],
        showSizeChanger: true,
        size: "small"
    });
    const handleTableChange = (pagination) => {
        setPagination({
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
        })

        getTableData({
            page: pagination.current - 1,
            limit: pagination.pageSize
        })

    };

    const handleAddNew = () => {
        navigator('add')
    }

    const openRow = (id) => {
        return navigator(`/autoblogs/${id}`)
    }

    const getTableData = async (filters = {}) => {


        setIsTableLoading(true)
        let response = await campaignsHandler.get(filters)
        setIsTableLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let data = response.data || []
        let summary_data = response.summary_data || {}
        let total_articles = Object.values(summary_data).reduce((sum, val) => sum + (val || 0), 0);

        let summaryCards = [...SummaryCards]

        summaryCards = summaryCards.map(s => {

            s.value = s.status_key == 'all' ? total_articles : summary_data[s.status_key] || 0

            return s
        })
        setSummaryCards(summaryCards)
        setPagination(prev => { return { ...prev, total: total_articles } })

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

        data = data?.map((d, idx) => {

            let status = getStatus(d.status)

            d.sno = idx + 1
            d.title = d.title || 'N/A'
            d.status = status.status
            d.status_key = status.status_key
            d.created_at = Utils.formateDateLabel({ ms: d.created_at })
            d.completion_percent = d.articles.length / parseInt(d.post_count) * 100
            return d
        })

        setCampaigns(data)


    }
    useEffect(() => {
        getTableData()
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
            <Routes>
                <Route exact path={`/add`} element={<CreateCampaign type="create" callback={getTableData} />}></Route>
                <Route exact path={`/:id`} element={<ViewCampaign type="create" callback={getTableData} />}></Route>
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
                            label: "New Campgain",
                            callback: handleAddNew,
                        }
                    ]}
                />

                <TopCards
                    items={SummaryCards}
                    loading={IsTableLoading}
                />
                <Table
                    has_select={false}
                    columns={TableColumns}
                    data={Campaigns}
                    loading={IsTableLoading}
                    pagination={pagination}
                    onChange={handleTableChange}
                />



            </PageContainer>
        </>
    );
};

export default Index;
