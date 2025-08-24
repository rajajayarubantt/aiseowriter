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
import Buttons from '../../components/Buttons'
import { PageContainer, PageHeader } from '../../components/Page'


/*Helpers*/
import Utils from "../../helpers/utils";
import dayjs from 'dayjs';

/*handler*/
import SubscriptionsHandler from '../../handlers/subscriptions/subscriptions'

const Index = () => {


    const REDIRECTION_URL = process.env.REACT_APP_PAYMENT_BASE_URL
    const BASE_URL = process.env.REACT_APP_PAYMENT_REDIRECTION_URL

    const navigator = useNavigate()
    const subscriptionsHandler = new SubscriptionsHandler()

    const store = useSelector(state => state)

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [Plans, setPlans] = useState([])
    const [DurationType, setDurationType] = useState('yearly')
    const [ActivePlan, setActivePlan] = useState('')
    const [isFreePlan, setIsFreePlan] = useState(true)

    const Yearly_offer_percentage = 50



    const getPlans = async (filters = {}) => {


        setIsLoading(true)
        let response = await subscriptionsHandler.getPlans(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let plans = response.data || []

        plans = plans?.map(plan => {

            plan.yearly_price = parseInt(Yearly_offer_percentage * parseInt(plan.monthly_price) / 100)
            plan.features = plan.features || []

            return plan
        })

        console.log(plans);



        setPlans(plans)


    }

    const createCheckoutUrl = ({ productId, redirect_url, fullName, email }) => {

        const params = new URLSearchParams({
            quantity: '1',
            redirect_url: REDIRECTION_URL,
            fullName,
            email
        });

        return `${BASE_URL}/${productId}?${params.toString()}`;
    }

    const handleUpgrade = (plan) => {

        const { _id, monthly_plan_id, yearly_plan_id } = plan

        if (ActivePlan == _id) return

        if (ActivePlan && !isFreePlan) {
            navigator('/support')
            return
        }

        const userdetails = JSON.parse(localStorage.getItem("userdetails") || "{}")

        if (!userdetails.email || !userdetails.name) {
            setWarningAlert(true)
            setWarningAlertType('warning')
            setwarningAlertMessage('Userdetails are Invalid, Please relogin!')
            return
        }

        const payload = {
            redirect_url: REDIRECTION_URL + `/${userdetails.org_id}`,
            fullName: userdetails.name,
            email: userdetails.email,
        }

        if (DurationType == 'monthly') {
            payload.productId = monthly_plan_id
        } else {
            payload.productId = yearly_plan_id
        }


        const url = createCheckoutUrl(payload)

        window.location.href = url
    }

    useEffect(() => {
        getPlans()
    }, [])

    useEffect(() => {

        if (store.user.subscription.plan_id) {
            setActivePlan(store.user.subscription.plan_id)
            setIsFreePlan(store.user.subscription.is_freeplan)
        }

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


            <div className="subscription-plans-main">

                <div className="header">
                    <div className="title">Budget pricing for all use cases</div>
                    <div className="desc">Enhance your blogging workflow with fluid & user-first AI-generated content.</div>
                </div>
                <div className="duration-toggle-main">
                    <div
                        className={`duration-toggle-item ${DurationType == 'yearly' ? 'active' : ''}`}
                        onClick={() => setDurationType('yearly')}
                    >Annual ({Yearly_offer_percentage}% off)</div>
                    <div
                        className={`duration-toggle-item ${DurationType == 'monthly' ? 'active' : ''}`}
                        onClick={() => setDurationType('monthly')}
                    >Monthly</div>
                </div>
                <div className="plan-items">
                    {Plans?.map((plan, idx) => (
                        <div
                            key={`plan-${idx}`}
                            className={`plan-item ${plan.recommended ? 'active' : ''}`}>

                            {plan.recommended ? <div className="recommended-plan">Most Popular</div> : null}
                            <div className="plan-item-name">{plan.name}</div>
                            <div className="plan-item-price-main">
                                <div className="price-value">${DurationType == 'yearly' ? plan.yearly_price : plan.monthly_price}</div>
                                <div className="price-label">/ month</div>
                            </div>
                            <div className="plan-item-features">
                                {plan.features?.map((feature, f_idx) => (
                                    <div
                                        key={`plan-${idx}-feature-${f_idx}`}
                                        className="features-item"
                                    >
                                        <div className="icon"
                                            dangerouslySetInnerHTML={{ __html: Icons.default.tick }}
                                        ></div>
                                        <div className="label">{feature}</div>
                                    </div>
                                ))}
                            </div>
                            {!plan.is_freeplan &&
                                <div className="plan-item-action">
                                    <Buttons
                                        type="primary"
                                        icon=""
                                        width="max"
                                        label={plan._id == ActivePlan ? "Your Active Plan" : ActivePlan && !isFreePlan ? 'Contact for Plan Change' : "Upgrade"}
                                        callback={() => handleUpgrade(plan)}
                                    />
                                </div>
                            }
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
};

export default Index;
