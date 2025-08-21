import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { Dropdown } from 'antd';

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
import CreatePlan from './CreatePlan'

/*Helpers*/
import Utils from "../../helpers/utils";

/*handler*/
import PlansHandler from '../../handlers/plans/plans'

const Index = () => {

    const PAGE_ID = "plans"

    const navigator = useNavigate()
    const plansHandler = new PlansHandler()

    const PAGE_TITLE = "Plans"
    const PAGE_DESC = "Browse all subscription plans."


    const [isLoading, setIsLoading] = useState(false)
    const [IsTableLoading, setIsTableLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [SummaryCards, setSummaryCards] = useState([
        {
            id: 'total_plans',
            type: 'total',
            label: 'Total plans',
            icon: Icons.default.plans,
            value: 0,
            status_key: 'all'

        },
        {
            id: 'inactive_plans',
            type: 'inprogress',
            label: 'In Active',
            icon: Icons.default.plans,
            value: 0,
            status_key: '0'
        },
        {
            id: 'active_plans',
            type: 'completed',
            label: 'Active',
            icon: Icons.default.plans,
            value: 0,
            status_key: '1'
        },

    ])

    const [Plans, setPlans] = useState([])


    const TableDopdownActions = [
        {
            id: 'edit',
            label: 'Edit',
            icon: Icons.default.edit,
            callback: (e, parent) => handleActions('edit', parent, e)
        },
        {
            id: 'delete',
            label: 'Delete',
            confirmation: true,
            confirmation_title: 'Delete the plan',
            confirmation_desc: 'Are you sure to delete this plan?',
            icon: Icons.default.delete,
            callback: (e, parent) => handleActions('delete', parent, e)
        },

    ];
    const TableColumns = [
        {
            title: 'S:No',
            dataIndex: 'sno',
            key: 'sno',
            width: 50,
        },
        {
            title: 'Plan Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div
                    className="table-title-main"
                    onClick={() => openArticle(record.id)}
                >
                    <div className="title-label">{text}</div>

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
            title: 'Blog count',
            dataIndex: 'blog_count',
            key: 'blog_count',
        },
        {
            title: 'Image count',
            dataIndex: 'image_count',
            key: 'image_count',
        },
        {
            title: 'Keywords count',
            dataIndex: 'keywords_count',
            key: 'keywords_count',
        },
        {
            title: 'Sitemap count',
            dataIndex: 'sitemap_count',
            key: 'sitemap_count',
        },
        {
            title: 'Users count',
            dataIndex: 'users_count',
            key: 'users_count',
        },
        {
            title: 'Monthly price',
            dataIndex: 'monthly_price',
            key: 'monthly_price',
            render: (text) => `$${text}`
        },
        {
            title: 'Last Updated on',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <ActionDropdown
                    id={record.id}
                    parent={record}
                    options={TableDopdownActions}
                />
            ),
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
            ...pagination
        })

        getTableData({
            page: pagination.current - 1,
            limit: pagination.pageSize
        })

    };

    const handleAddNew = () => {
        navigator('add')
    }

    const openArticle = (id) => {
        return navigator(`/plans/${id}`)
    }
    const deleteArticle = async (id) => {

        let filters = {
            id: String(id)
        }
        setIsLoading(true)
        let response = await plansHandler.delete(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        getTableData()
    }

    const handleActions = (action, parent, e) => {
        if (action == 'edit') openArticle(parent.id)
        else if (action == 'delete') deleteArticle(parent.id)
    }

    const getTableData = async (filters = {}) => {


        setIsTableLoading(true)
        let response = await plansHandler.get(filters)
        setIsTableLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let plans_data = response.data || []
        let summary_data = response.summary_data || {}
        let total_plans = Object.values(summary_data).reduce((sum, val) => sum + (val || 0), 0);

        let summaryCards = [...SummaryCards]

        summaryCards = summaryCards.map(s => {

            s.value = s.status_key == 'all' ? total_plans : summary_data[s.status_key] || 0

            return s
        })
        setSummaryCards(summaryCards)
        setPagination(prev => { return { ...prev, total: total_plans } })
        const getStatus = (status) => {
            if (status == '0') {

                return {
                    status: 'In Active',
                    status_key: 'draft'
                }
            }
            else if (status == '1') {

                return {
                    status: 'Active',
                    status_key: 'completed'
                }
            }

        }

        plans_data = plans_data?.map((d, idx) => {

            let status = getStatus(d.status)

            d.sno = idx + 1
            d.title = d.title || 'N/A'
            d.status = status.status
            d.status_key = status.status_key
            d.lastupdated = Utils.formateDateLabel({ ms: d.updated_at })
            return d
        })

        setPlans(plans_data)


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
                <Route exact path={`/add`} element={<CreatePlan callback={getTableData} />}></Route>
                <Route exact path={`/:id`} element={<CreatePlan callback={getTableData} />}></Route>
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
                            label: "Create Plan",
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
                    data={Plans}
                    loading={IsTableLoading}
                    pagination={pagination}
                    onChange={handleTableChange}
                />



            </PageContainer>
        </>
    );
};

export default Index;
