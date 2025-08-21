import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'

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
import CreateArticle from './CreateArticle'

/*Helpers*/
import Utils from "../../helpers/utils";

/*handler*/
import ArticlesHandler from '../../handlers/articles/articles'

const Index = () => {

    const PAGE_ID = "articles"

    const navigator = useNavigate()
    const articlesHandler = new ArticlesHandler()

    const PAGE_TITLE = "Articles"
    const PAGE_DESC = "Browse through all articles that you've generated so far."

    const store = useSelector(state => state)

    const [isLoading, setIsLoading] = useState(false)
    const [IsTableLoading, setIsTableLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [SummaryCards, setSummaryCards] = useState([
        {
            id: 'total_articles',
            type: 'total',
            label: 'Total Articles',
            icon: Icons.default.articles,
            value: 0,
            status_key: 'all'

        },
        {
            id: 'inprogress_articles',
            type: 'inprogress',
            label: 'Draft',
            icon: Icons.default.articles,
            value: 0,
            status_key: '0'
        },
        {
            id: 'completed_articles',
            type: 'completed',
            label: 'Draft Completed',
            icon: Icons.default.articles,
            value: 0,
            status_key: '1'
        },
        {
            id: 'published_articles',
            type: 'published',
            label: 'Published',
            icon: Icons.default.articles,
            value: 0,
            status_key: '2'

        },
    ])

    const [Articles, setArticles] = useState([])

    const [HasNoLimit, setHasNoLimit] = useState(true)

    const TableDopdownActions = [
        {
            id: 'edit',
            label: 'Edit',
            icon: Icons.default.edit,
            callback: (e, parent) => handleArticleActions('edit', parent, e)
        },
        {
            id: 'delete',
            label: 'Delete',
            confirmation: true,
            confirmation_title: 'Delete the article',
            confirmation_desc: 'Are you sure to delete this article?',
            icon: Icons.default.delete,
            callback: (e, parent) => handleArticleActions('delete', parent, e)
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
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div
                    className="table-title-main"
                    onClick={() => openArticle(record.id)}
                >
                    <div className="title-label">{text}</div>
                    <div className="title-tags">
                        {record?.keywords.map((key, i) => (
                            <div className="title-tag">{key}</div>
                        ))}
                    </div>
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
            title: 'Word count',
            dataIndex: 'words',
            key: 'words',
            render: (text) => `${text}+`
        },
        {
            title: 'Last Updated on',
            dataIndex: 'lastupdated',
            key: 'lastupdated',
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
        return navigator(`/article/${id}`)
    }
    const deleteArticle = async (id) => {

        let filters = {
            id: String(id)
        }
        setIsLoading(true)
        let response = await articlesHandler.delete(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        getTableData()
    }

    const handleArticleActions = (action, parent, e) => {
        if (action == 'edit') openArticle(parent.id)
        else if (action == 'delete') deleteArticle(parent.id)
    }

    const getTableData = async (filters = {}) => {


        setIsTableLoading(true)
        let response = await articlesHandler.get(filters)
        setIsTableLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let articles_data = response.data || []
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
                    status: 'draft',
                    status_key: 'draft'
                }
            }
            else if (status == '1') {

                return {
                    status: 'Draft Completed',
                    status_key: 'inprogress'
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
        }

        articles_data = articles_data?.map((d, idx) => {

            let status = getStatus(d.status)

            d.sno = idx + 1
            d.title = d.title || 'N/A'
            d.status = status.status
            d.status_key = status.status_key
            d.words = d.words || Utils.countWords(d.content)
            d.lastupdated = Utils.formateDateLabel({ ms: d.updated_at })
            return d
        })

        setArticles(articles_data)


    }
    useEffect(() => {
        getTableData()
    }, [])

    useEffect(() => {

        if (store.user.subscription.limitations) setHasNoLimit(store.user.subscription.limitations.articles <= 0)

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
                <Route exact path={`/add`} element={<CreateArticle type="create" callback={getTableData} />}></Route>
            </Routes>

            <PageContainer id={PAGE_ID}>
                <PageHeader
                    id={PAGE_ID}
                    title={PAGE_TITLE}
                    desc={PAGE_DESC}
                    actions={[

                        {
                            type: "primary",
                            icon: Icons.default.magic_brush,
                            width: "auto",
                            label: "Generate Article",
                            has_no_limit: HasNoLimit,
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
                    data={Articles}
                    loading={IsTableLoading}
                    pagination={pagination}
                    onChange={handleTableChange}
                />



            </PageContainer>
        </>
    );
};

export default Index;
