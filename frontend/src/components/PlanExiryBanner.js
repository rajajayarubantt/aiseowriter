
import React, { useEffect, useState } from 'react'

/* Redux Setup*/
import { Link, useNavigate, Route, Routes, BrowserRouter, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store from '../redux/store'
import ReverseProxy from '../config/reverseProxy'

import Images from '../assets/Images'
import Icons from '../assets/Icons'

const PlanExiryBanner = ({ credit_expiry = false, expiry_days }) => {

    const navigate = useNavigate()

    const HandleViewPlans = (e) => {
        navigate(`/upgrade`)
    }

    return (
        <div className="freeplan_expiry_banner-main">
            <div className="banner-content">
                <div className="banner-content-item">
                    <div
                        className="icon icon-warning"
                        dangerouslySetInnerHTML={{ __html: Icons.default.warning }}
                    ></div>
                    {credit_expiry ?
                        <div className="message">
                            {expiry_days <= 0 ? "Your've run out of blog credits. Please upgrade your plan to continue generating Blogs" : `Your blog credits is low. Please upgrade your plan to continue generating Blogs`}
                        </div>
                        :
                        <div className="message">
                            {expiry_days <= 0 ? 'Your plan has expired.' : `Your plan will expire in ${expiry_days} days.`}
                        </div>
                    }
                </div>
                <div
                    className="banner-content-item content-link"
                    onClick={HandleViewPlans}
                >
                    <div className="message">
                        Upgrade Now
                    </div>
                </div>

            </div>
        </div>
    )

}

export default PlanExiryBanner;