import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { Dropdown } from 'antd';

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import KPICards from '../../components/dashboard/KPICards'
import LineChart from '../../components/dashboard/LineChart'
import DonutChart from '../../components/dashboard/DonutChart'
import BarChart from '../../components/dashboard/BarChart'
import Table from '../../components/Table'
/*Helpers*/
import Utils from "../../helpers/utils";

/*Handler */
import DashboardHandler from '../../handlers/dashboard/dashboard'

const Index = () => {

    const PAGE_ID = "plans"

    const navigator = useNavigate()
    const dashboardHandler = new DashboardHandler()


    const [isLoading, setIsLoading] = useState(false)
    const [IsTableLoading, setIsTableLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const TableColumns = [
        {
            title: 'S:No',
            dataIndex: 'sno',
            key: 'sno',
            width: 30,
            render: (text, record, index) => index + 1
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Subscription',
            dataIndex: 'subscription_plan',
            key: 'subscription_plan',
        },
        {
            title: 'Articles Count',
            dataIndex: 'article_count',
            key: 'article_count',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text, record) => Utils.formateDateLabel({ ms: text })
        },


    ]

    // Dummy data for dashboard
    const [kpiData, setKpiData] = useState({})

    const [revenueData, setRevenueData] = useState({
        labels: [],
        datasets: [{
            label: 'MRR ($)',
            data: [],
            borderColor: '#4137FE',
            backgroundColor: '#4137fe20',
            tension: 0.4
        }]
    })

    const [subscriptionData, setSubscriptionData] = useState({
        labels: ['Free', 'Starter', 'Pro', 'Enterprise'],
        datasets: [{
            data: [45, 30, 20, 5],
            backgroundColor: ['#f44336', '#f29d41', '#4137FE', '#07c07e'],
            borderWidth: 0
        }]
    })

    const [articlesData, setArticlesData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Articles Generated',
            data: [8500, 9200, 11000, 12800, 14100, 15420],
            backgroundColor: '#2bad00ff',
            borderColor: '#2bad00ff',
            borderRadius: 4
        }]
    })

    const [keywordsData, setKeywordsData] = useState({
        labels: ['SEO', 'Marketing', 'Business', 'Technology', 'Health', 'Finance'],
        datasets: [{
            label: 'Usage Count',
            data: [1250, 980, 750, 650, 520, 480],
            backgroundColor: '#4137FE',
            borderRadius: 4
        }]
    })

    const [integrationsData, setIntegrationsData] = useState({
        labels: ['WordPress', 'LinkedIn', 'Notion', 'Webflow', 'Ghost'],
        datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: ['#21759b', '#b57c00ff', '#ffcf23ff', '#4353ff', '#9e0578ff', '#9e2b05ff'],
            borderWidth: 0
        }]
    })

    const [campaignsData] = useState({
        labels: ['Success', 'Failed', 'Scheduled', 'Running'],
        datasets: [{
            data: [65, 10, 15, 10],
            backgroundColor: ['#07c07e', '#f44336', '#f29d41', '#4137FE'],
            borderWidth: 0
        }]
    })

    const [creditsData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Credits Used',
            data: [75, 82, 78, 85, 88, 92],
            borderColor: '#07c07e',
            backgroundColor: 'rgba(7, 192, 126, 0.1)',
            fill: true,
            tension: 0.4
        }]
    })

    const [topUsers, setTopUsers] = useState({
        labels: ['TechCorp', 'HealthPlus', 'FinanceHub', 'EcoGreen', 'FoodieWorld'],
        datasets: [{
            label: 'Articles',
            data: [450, 380, 320, 280, 250],
            backgroundColor: '#bc37feff',
            borderRadius: 4
        }]
    })

    const [userData, setUserData] = useState([])

    const getData = async () => {
        setIsLoading(true)

        const response = await dashboardHandler.get()
        setIsLoading(false)
        if (!response.success) {

            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        const { kpi_data, articles_trend, integration_ration, keywords_ration, subscription_plan_ration, subscriptions_trend, users_analytics } = response.data || {}

        setKpiData(kpi_data)

        let subscriptions_trend_labels = Object.keys(subscriptions_trend).map(item => Utils.formateDateLabel({ ms: parseFloat(item) }))
        let subscriptions_trend_data = Object.values(subscriptions_trend)

        setRevenueData(prev => ({
            ...prev,
            labels: subscriptions_trend_labels,
            datasets: [{
                ...prev.datasets[0],
                data: subscriptions_trend_data
            }]
        }))

        let subscriptions_ration_label = Object.keys(subscription_plan_ration)
        let subscriptions_ration_data = Object.values(subscription_plan_ration)

        setSubscriptionData(prev => ({
            ...prev,
            labels: subscriptions_ration_label,
            datasets: [{
                ...prev.datasets[0],
                data: subscriptions_ration_data
            }]
        }))

        let article_trend_labels = Object.keys(articles_trend).map(item => Utils.formateDateLabel({ ms: parseFloat(item) }))
        let article_trend_data = Object.values(articles_trend)

        setArticlesData(prev => ({
            ...prev,
            labels: article_trend_labels,
            datasets: [{
                ...prev.datasets[0],
                data: article_trend_data
            }]
        }))

        let keywords_ration_label = Object.keys(keywords_ration)
        let keywords_ration_data = Object.values(keywords_ration)

        setKeywordsData(prev => ({
            ...prev,
            labels: keywords_ration_label,
            datasets: [{
                ...prev.datasets[0],
                data: keywords_ration_data
            }]
        }))

        let integration_ration_label = Object.keys(integration_ration)
        let integration_ration_data = Object.values(integration_ration)

        setIntegrationsData(prev => ({
            ...prev,
            labels: integration_ration_label,
            datasets: [{
                ...prev.datasets[0],
                data: integration_ration_data
            }]
        }))

        let user_data_label = users_analytics.filter(item => item.article_count > 0).map(item => item.name)
        let user_data_value = users_analytics.filter(item => item.article_count > 0).map(item => item.article_count)

        setTopUsers(prev => ({
            ...prev,
            labels: user_data_label,
            datasets: [{
                ...prev.datasets[0],
                data: user_data_value
            }]
        }))

        setUserData(users_analytics)

    }


    useEffect(() => {
        getData()
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


            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <KPICards data={kpiData} />

                <div className="dashboard-row">
                    <div className="chart-card">
                        <LineChart title="MRR Trend" data={revenueData} />
                    </div>
                    <div className="chart-card">
                        <LineChart title="Articles Generated Over Time" data={articlesData} />
                    </div>
                </div>

                <div className="dashboard-row">
                    <div className="chart-card">
                        <DonutChart title="Subscriptions by Plan" data={subscriptionData} />
                    </div>
                    <div className="chart-card">
                        <BarChart title="Popular Keywords" data={keywordsData} />
                    </div>
                </div>

                <div className="dashboard-row">
                    <div className="chart-card">
                        <DonutChart title="Integrations Usage" data={integrationsData} />
                    </div>
                    <div className="chart-card">
                        <BarChart title="Top Users" data={topUsers} />
                    </div>
                </div>

                <div className="dashboard-row">
                    <Table
                        has_select={false}
                        columns={TableColumns}
                        data={userData}
                        loading={IsTableLoading}
                    />
                </div>

            </div>

        </>
    );
};

export default Index;
