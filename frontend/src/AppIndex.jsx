import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import UserAction from './redux/action/userAction'
/*Pages*/
import Articles from "./pages/articles";
import Autoblogs from "./pages/autoblogs";
import Home from "./pages/home";
import Pilot from "./pages/pilot";
import Integration from "./pages/integration";
import Brand from "./pages/brand";
import Sitemap from "./pages/sitemap";
import Settings from "./pages/settings";

import Upgrade from "./pages/subscriptions/upgrade";
import Subscribe from "./pages/subscriptions/subscribe";

/*Assets*/
import Images from "./assets/Images";
import Icons from "./assets/Icons";

/*Components*/
import Sidebars from "./components/Sidebars";
import PlanExiryBanner from "./components/PlanExiryBanner";

/*Custom hook*/
import { useAuth } from "./hooks/AuthContext";

/*handler*/
import SubscriptionsHandler from './handlers/subscriptions/subscriptions'

const AppIndex = () => {

  const { logout } = useAuth()
  const navigator = useNavigate()
  const subscriptionsHandler = new SubscriptionsHandler()

  const dispatch = useDispatch()
  const store = useSelector(state => state)
  const { updateState } = new UserAction

  const [Userdetails, setUserdetails] = useState({})
  const [NavMenus, setNavMenus] = useState({
    top: [
      {
        id: "articles",
        label: "Articles",
        icon: Icons.default.articles,
      },
      {
        id: "autoblogs",
        label: "Auto blogs",
        icon: Icons.default.automation,
      },
      {
        id: "coverpages",
        label: "Cover pages",
        disable: true,
        icon: Icons.default.coverpage,
      },
      {
        id: "integration",
        label: "Integrations",
        icon: Icons.default.integration,
      },
      {
        id: "brand",
        label: "Brands",
        icon: Icons.default.brand,
      },
      // {
      //   id: "analytics",
      //   label: "Analytics",
      //   icon: Icons.default.analytics,
      // },
      {
        id: "sitemap",
        label: "Sitemap",
        icon: Icons.default.sitemap,
      },
      {
        id: "settings",
        label: "Settings",
        icon: Icons.default._settings,
      },

    ],
    bottom: [
      {
        id: "api",
        label: "API",
        icon: Icons.default.api,
        disable: true,
      },
      {
        id: "https://aiseowriter.canny.io/feature-requests",
        label: "Give feedback",
        link: true,
        icon: Icons.default.feedback,
      },
      {
        id: "https://aiseowrite.in/blog",
        label: "Marketing Guide",
        link: true,
        icon: Icons.default.guide,
      },
      {
        id: "upgrade",
        label: "Upgrade plan",
        icon: Icons.default.billing,
      },
      {
        id: "https://aiseowriter.featurebase.app/help",
        label: "Help & Support",
        link: true,
        icon: Icons.default.help,
      },
    ]
  });
  const [CreditLimit, setCreditLimit] = useState(0);
  const [PlanExpiryDays, setPlanExpiryDays] = useState(0)


  const handleLogoutCallback = () => {
    logout()
  }

  const getUserDetails = () => {

    const userdetails = JSON.parse(localStorage.getItem('userdetails') || "{}")

    setUserdetails(userdetails)

  }

  const checkSubscription = async () => {

    let response = await subscriptionsHandler.get({})

    if (response.success) {

      dispatch(updateState({
        type: 'SET_SUBSCRIPTION',
        payload: {
          subscription: response.data
        }
      }))
    }
  }

  useEffect(() => {

    getUserDetails()
    // checkSubscription()
  }, [])

  useEffect(() => {

    setCreditLimit(store.user.subscription.balance_credits)
    setPlanExpiryDays(store.user.subscription.expiry_duration_days)

  }, [store.user.subscription])

  return (
    <div className="main-app-container">
      <Sidebars menus={NavMenus} userdetails={Userdetails} credit_limit={CreditLimit} logout_callback={handleLogoutCallback} />

      <div className="app-container-content">
        {PlanExpiryDays <= 10 ?
          <PlanExiryBanner
            expiry_days={PlanExpiryDays}
          />
          : ''}
        {CreditLimit < 5 ?
          <PlanExiryBanner
            credit_expiry={true}
            expiry_days={CreditLimit}
          />
          : ''}
        <Routes>
          <Route exact path={`/articles/*`} element={<Articles />}></Route>
          <Route exact path={`/autoblogs/*`} element={<Autoblogs />}></Route>
          {/* <Route exact path={`/*`} element={<Home />}></Route> */}
          <Route exact path={`/pilot/*`} element={<Pilot />}></Route>
          <Route exact path={`/integration/*`} element={<Integration />}></Route>
          <Route exact path={`/brand/*`} element={<Brand />}></Route>
          <Route exact path={`/sitemap/*`} element={<Sitemap />}></Route>
          <Route exact path={`/settings/*`} element={<Settings />}></Route>

          <Route exact path={`/subscribe/*`} element={<Subscribe />}></Route>
          <Route exact path={`/upgrade/*`} element={<Upgrade />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default AppIndex;
