import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers */
import Utils from "../../helpers/utils";

const Index = ({ menus, userdetails, credit_limit = 0, logout_callback = () => { } }) => {
  const navigate = useNavigate();

  const currentURL = window.location.pathname;
  const selectSection = currentURL ? currentURL.split(`/`)[1] : undefined;

  const [NavMenus, setNavMenus] = useState({
    top: [],
    bottom: [],
  });

  const [SelectedNavItem, setSelectedNavItem] = useState(selectSection || "#");

  const [EnableMobileView, setEnableMobileView] = useState(false);

  const handleNavItemClick = (item) => {
    if (item.link) {
      window.open(item.id, "_blank");
    } else {
      navigate(`/${item.id}`);
      setSelectedNavItem(item.id);
    }

    setEnableMobileView(false)
  };

  const handleEnableMobileView = () => {
    setEnableMobileView(!EnableMobileView);
  };

  const handleLogoutCallback = (e) => {
    if (logout_callback) logout_callback()
  }

  const [UserName, setUserName] = useState("");
  const [UserEmail, setUserEmail] = useState("");
  const [UserImage, setUserImage] = useState("");

  useEffect(() => {

    if (menus) {
      setNavMenus(menus)
      handleNavItemClick(menus.top[0])
    }
    if (userdetails) {
      const { profile_url, name, email } = userdetails
      setUserName(name || "")
      setUserEmail(email || "")
      if (profile_url) setUserImage(profile_url)

      if (name && !profile_url) {
        let user_Image = Utils.generateInitialsImage(name, {
          backgroundColor: "#000",
          fontSize: 34,
          width: 100,
          height: 100,
        });

        if (user_Image) setUserImage(user_Image);
      }
    }

  }, [userdetails]);


  return (
    <div
      className={`app-sidebar-main ${EnableMobileView ? "app-sidebar-mobile-view" : ""
        }`}
    >
      <div
        className="sidebar-mobile-btn"
        dangerouslySetInnerHTML={{ __html: Icons.default.dropdown_arrow }}
        onClick={() => handleEnableMobileView()}
      ></div>
      <section className="sidebar-content-section">
        <div className="sidebar-logo">
          <img className="logo-img" src={Images.Logo} alt="logo" />
          <div className="logo-name">Ai SEO Writer</div>
        </div>
        <div className="sidebar-nav-items">
          {NavMenus.top?.filter(n => !n.disable).map((nav, idx) => (
            <div
              key={`sidebar-nav-item-${nav.id || idx}`}
              className={`nav-item ${SelectedNavItem == nav.id ? "nav-item-active" : ""
                }`}
              onClick={() => handleNavItemClick(nav)}
            >
              <div
                className="nav-item-icon"
                dangerouslySetInnerHTML={{ __html: nav.icon }}
              ></div>
              <div className="nav-item-label">{nav.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="sidebar-content-section">
        <div className="sidebar-nav-items">
          {NavMenus.bottom?.filter(n => !n.disable).map((nav, idx) => (
            <div
              key={`sidebar-nav-item-${nav.id || idx}`}
              className={`nav-item ${SelectedNavItem == nav.id ? "nav-item-active" : ""
                }`}
              onClick={() => handleNavItemClick(nav)}
            >
              <div
                className="nav-item-icon"
                dangerouslySetInnerHTML={{ __html: nav.icon }}
              ></div>
              <div className="nav-item-label">{nav.label}</div>
            </div>
          ))}
        </div>
        <div className="sidebar-creditlimit">
          <div className="creditlimit-value">{credit_limit}</div>
          <div className="creditlimit-label">Blog Credits left</div>
        </div>
        <div className="sidebar-profile-main">
          <img className="profile-img" src={UserImage} alt="" />
          <div className="profile-details">
            <div className="profile-name">{UserName}</div>
            <div className="profile-email">{UserEmail}</div>
          </div>
          <div
            className="profile-logout"
            dangerouslySetInnerHTML={{ __html: Icons.default.logout }}
            onClick={handleLogoutCallback}
          ></div>
        </div>
      </section>
    </div>
  );
};

export default Index;
