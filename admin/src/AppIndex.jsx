import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

/*Pages*/
import Articles from "./pages/articles";
import Plans from "./pages/plans";
import Customers from "./pages/customers";

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
        id: "customer",
        label: "Customer",
        icon: Icons.default.users,
      },
      {
        id: "articles",
        label: "Articles",
        icon: Icons.default.articles,
      },
      {
        id: "plans",
        label: "Plans",
        icon: Icons.default.plans,
      },


    ],
    bottom: [

    ]
  });

  const handleLogoutCallback = () => {
    logout()
  }

  const getUserDetails = () => {

    console.log(localStorage.getItem('userdetails'), 'userdetails');

    const userdetails = JSON.parse(localStorage.getItem('userdetails') || "{}")

    setUserdetails(userdetails)

  }

  useEffect(() => {

    getUserDetails()
  }, [])

  return (
    <div className="main-app-container">
      <Sidebars menus={NavMenus} userdetails={Userdetails} credit_limit={10} logout_callback={handleLogoutCallback} />
      <div className="app-container-content">
        <Routes>
          <Route exact path={`/customer/*`} element={<Customers />}></Route>
          <Route exact path={`/articles/*`} element={<Articles />}></Route>
          <Route exact path={`/plans/*`} element={<Plans />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default AppIndex;
