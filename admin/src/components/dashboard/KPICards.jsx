import React from 'react';

const KPICards = ({ data }) => {
    return (
        <div className="kpi-cards">
            <div className="kpi-card">
                <div className="kpi-value">${data.total_mrr}</div>
                <div className="kpi-label">MRR</div>
                <div className="kpi-change positive">Customers: {data.total_paid_users}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-value">{data.total_users}</div>
                <div className="kpi-label">Customers</div>
                <div className="kpi-change positive">Paid: {data.total_paid_users}</div>
                <div className="kpi-change negative">Free: {data.total_free_users}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-value">{data.total_articles}</div>
                <div className="kpi-label">Articles Generated</div>
                <div className="kpi-change positive">Credits Used: {data.total_articles}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-value">{data.churnRate}%</div>
                <div className="kpi-label">Churn Rate</div>
                <div className="kpi-change positive">-{data.churnImprovement}%</div>
            </div>
        </div>
    );
};

export default KPICards;