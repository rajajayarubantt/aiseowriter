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
import CustomersHandler from '../../handlers/customers/customers'

const Index = () => {

    const PAGE_ID = "plans"

    const navigator = useNavigate()
    const customersHandler = new CustomersHandler()

    const PAGE_TITLE = "Customers"
    const PAGE_DESC = "Browse all freemium & paid customers."


    const [isLoading, setIsLoading] = useState(false)
    const [IsTableLoading, setIsTableLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [SummaryCards, setSummaryCards] = useState([
        {
            id: 'total',
            type: 'total',
            label: 'Total Customers',
            icon: Icons.default.plans,
            value: 0,
            status_key: 'all'

        },
        {
            id: 'free',
            type: 'inprogress',
            label: 'Freeimum',
            icon: Icons.default.plans,
            value: 0,
            status_key: '0'
        },
        {
            id: 'paid',
            type: 'completed',
            label: 'Paid Customers',
            icon: Icons.default.plans,
            value: 0,
            status_key: '1'
        },

    ])

    const [Customers, setCustomers] = useState([])


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
            title: 'Name',
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Google Auth',
            dataIndex: 'google_id',
            key: 'google_id',
            render: (text, record) => text ? "Yes" : "No"
        },
        {
            title: 'Onboarding',
            dataIndex: 'onboarding_status',
            key: 'onboarding_status',
            render: (text, record) => text == '1' ? "Done" : "Not Yet"
        },

        {
            title: 'Plan',
            dataIndex: 'plan_name',
            key: 'plan_name',
        },
        {
            title: 'Plan type',
            dataIndex: 'is_freeplan',
            key: 'is_freeplan',
            render: (text, record) => text ? "Free" : "Paid"
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
            title: 'Plan Duration',
            dataIndex: 'plan_duration',
            key: 'plan_duration',
        },
        {
            title: 'Subscription',
            dataIndex: 'subscription_status',
            key: 'subscription_status',
        },

        {
            title: 'Joined On',
            dataIndex: 'created_at',
            key: 'created_at',
        },

        {
            title: 'Subscribed On',
            dataIndex: 'subscribed_at',
            key: 'subscribed_at',
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
        let response = await customersHandler.delete(filters)
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
        let response = await customersHandler.get(filters)
        setIsTableLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let plans_data = response.data || []
        let summary_data = response.summary_data || {}


        let summaryCards = [...SummaryCards]

        let total = plans_data.length
        let free_users_count = plans_data.filter(p => p.is_freeplan).length
        let paid_users_count = plans_data.filter(p => p.subscription_id && p.subscription_id != "free").length

        summaryCards[0].value = total
        summaryCards[1].value = free_users_count
        summaryCards[2].value = paid_users_count

        setSummaryCards(summaryCards)
        setPagination(prev => { return { ...prev, total: total } })

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
            d.created_at = Utils.formateDateLabel({ ms: d.created_at })
            d.updated_at = Utils.formateDateLabel({ ms: d.updated_at })
            d.subscribed_at = Utils.formateDateLabel({ ms: d.subscribed_at })

            return d
        })

        setCustomers(plans_data)


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
                    actions={[]}
                />
                <TopCards
                    items={SummaryCards}
                    loading={IsTableLoading}
                />
                <Table
                    has_select={false}
                    columns={TableColumns}
                    data={Customers}
                    loading={IsTableLoading}
                    pagination={pagination}
                    onChange={handleTableChange}
                />



            </PageContainer>
        </>
    );
};

export default Index;
