import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

/*Pages*/
import Articles from "./pages/articles";
import Autoblogs from "./pages/autoblogs";
import Home from "./pages/home";
import Pilot from "./pages/pilot";
import Integration from "./pages/integration";
import Brand from "./pages/brand";
import Settings from "./pages/settings";

/*Assets*/
import Images from "./assets/Images";
import Icons from "./assets/Icons";

/*Components*/
import Sidebars from "./components/Sidebars";

/*Custom hook*/
import { useAuth } from "./hooks/AuthContext";

const AppIndex = () => {

  const { logout } = useAuth()

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
      {
        id: "analytics",
        label: "Analytics",
        icon: Icons.default.analytics,
      },
      {
        id: "sitemap",
        label: "Sitemap",
        icon: Icons.default.sitemap,
      },
      {
        id: "settings",
        label: "Team",
        icon: Icons.default.users,
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
        id: "feature-requests",
        label: "Give feedback",
        icon: Icons.default.feedback,
      },
      {
        id: "micro-tools",
        label: "Micro tools",
        icon: Icons.default.guide,
      },
      {
        id: "upgrade",
        label: "Upgrade plan",
        icon: Icons.default.billing,
      },
      {
        id: "help-center",
        label: "Help center",
        icon: Icons.default.help,
      },
    ]
  });
  const [CreditLimit, setCreditLimit] = useState(5);

  const handleLogoutCallback = () => {
    logout()
  }

  const getUserDetails = () => {

    const userdetails = JSON.parse(localStorage.getItem('userdetails') || "{}")

    setUserdetails(userdetails)

  }

  useEffect(() => {

    getUserDetails()
  }, [])

  return (
    <div className="main-app-container">
      <Sidebars menus={NavMenus} userdetails={Userdetails} credit_limit={CreditLimit} logout_callback={handleLogoutCallback} />
      <div className="app-container-content">
        <Routes>
          <Route exact path={`/articles/*`} element={<Articles />}></Route>
          <Route exact path={`/autoblogs/*`} element={<Autoblogs />}></Route>
          <Route exact path={`/*`} element={<Home />}></Route>
          <Route exact path={`/pilot/*`} element={<Pilot />}></Route>
          <Route exact path={`/integration/*`} element={<Integration />}></Route>
          <Route exact path={`/brand/*`} element={<Brand />}></Route>
          <Route exact path={`/settings/*`} element={<Settings />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default AppIndex;
