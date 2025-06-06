
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/*Assets */
import Icons from '../../assets/Icons'
import Images from '../../assets/Images'

/*Components */
import ButtonsWrapper from '../ButtonsWrapper'
import Buttons from '../Buttons'
import PopupWrapper from '../Popup/Wrapper'

const Index = () => {


    const navigator = useNavigate()

    const NavItems = [

        {
            id: 'pricing',
            icon: Icons.default.price_tag,

            label: "Pricing",
            has_dropdown: false,
            dropdown_items: []
        },
        {
            id: 'features',
            icon: Icons.default.features,
            label: "Features",
            has_dropdown: true,
            dropdown_items: [
                {
                    id: '1',
                    title: 'Text-to-meme',
                    icon: Icons.default.pilot,
                    desc: 'Enter any text and let AI generate memes for you'
                },
                {
                    id: '2',
                    title: 'Text-to-meme',
                    icon: Icons.default.pilot,
                    desc: 'Enter any text and let AI generate memes for you'
                },
                {
                    id: '3',
                    title: 'Text-to-meme',
                    icon: Icons.default.pilot,
                    desc: 'Enter any text and let AI generate memes for you'
                },
            ]
        },
        {
            id: 'blog',
            icon: Icons.default.blogs,
            label: "Blog",
            has_dropdown: false,
            dropdown_items: []
        },
        // {
        //     id: 'affiliates',
        //     icon: Icons.default.affiliates,
        //     label: "Affiliates",
        //     has_dropdown: false,
        //     dropdown_items: []
        // },
        // {
        //     id: 'api',
        //     icon: Icons.default.api,
        //     label: "API",
        //     has_dropdown: false,
        //     dropdown_items: []
        // },
    ]

    const [MobileMenuActive, setMobileMenuActive] = useState(false)

    const handleMobileMenuStatus = (status) => {
        setMobileMenuActive(status)
    }
    const handleRedirection = (url) => {
        handleMobileMenuStatus(false)
        navigator(url)
    }

    return (
        <div className="navbar-main">
            <div className="navbar-content-main content-wrapper-main">
                <Link to={'/'} className="navbar-logo">
                    <img className='logo-img' src={Images.Logo} alt="zenblog logo" />
                    <div className='logo-title'>Ai SEO Writer</div>
                </Link>
                <div className="navbar-links">

                    <div className="navbar-nav-items">
                        {NavItems?.map((nav, idx) => (
                            <div
                                key={`nav-item-${nav.id}-${idx}`}
                                className="navbar-nav-item"
                            >
                                <div className="active-bar"></div>
                                <Link to={`/${nav.id}`} className="item-label">{nav.label}</Link>
                                {nav.has_dropdown &&
                                    <>
                                        <div className="item-dropdown-icon" dangerouslySetInnerHTML={{ __html: Icons.default.dropdown_arrow }}></div>
                                        <div className="item-dropdown-main">
                                            {nav.dropdown_items?.map((item, di) => (
                                                <Link
                                                    key={`nav-item-${nav.id}-${item.id}`}
                                                    className="dropdown-item"
                                                    to={`/${item.id}`}
                                                >
                                                    <div className="dropdown-item-menu">
                                                        <div
                                                            className="icon"
                                                            dangerouslySetInnerHTML={{ __html: item.icon }}
                                                        ></div>
                                                        <div className="label">{item.title}</div>
                                                    </div>
                                                    <div className="dropdown-item-desc">{item.desc}</div>

                                                </Link>
                                            ))}


                                        </div>
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div className="navbar-actions">

                    <ButtonsWrapper>
                        <Buttons
                            width='auto'
                            type='primary'
                            label='Unlock Early Access!'
                            icon={Icons.default.offer}
                            // icon_left={false}
                            callback={() => handleRedirection('/early-bird-program')}
                        />
                    </ButtonsWrapper>
                </div>
                <div className="navbar-mobile-menu">
                    <div
                        className="mobile-menu-button" dangerouslySetInnerHTML={{ __html: Icons.default.menu }}
                        onClick={() => handleMobileMenuStatus(!MobileMenuActive)}
                    ></div>
                    {MobileMenuActive &&
                        <PopupWrapper>
                            <div className={`mobile-menu-container ${MobileMenuActive && 'mobile-menu-active'}`}>
                                <div className="container-header">
                                    <Link

                                        to={'/'}
                                        className="header-logo"
                                        onClick={() => handleMobileMenuStatus(!MobileMenuActive)}
                                    >
                                        <img className='logo-img' src={Images.Logo} alt="zenblog logo" />
                                        <div className='logo-title'>Ai SEO Writer</div>
                                    </Link>
                                    <div
                                        className="header-close"
                                        dangerouslySetInnerHTML={{ __html: Icons.default.close_x }}
                                        onClick={() => handleMobileMenuStatus(!MobileMenuActive)}
                                    ></div>

                                </div>
                                <div className="container-items">
                                    {NavItems?.map((nav, idx) => (
                                        <Link
                                            key={`nav-item-${nav.id}-${idx}`}
                                            className="container-item"
                                            to={`/${nav.id}`}
                                            onClick={() => handleMobileMenuStatus(!MobileMenuActive)}
                                        >
                                            {nav.icon && <div className="item-icon" dangerouslySetInnerHTML={{ __html: nav.icon }}></div>}
                                            <div className="item-label">{nav.label}</div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="container-actions">
                                    {/* <Buttons
                                        id="login-button"
                                        width='half'
                                        type='default'
                                        label='Login'
                                        callback={() => handleRedirection('/login')}
                                    /> */}
                                    <Buttons
                                        id="login-button"
                                        width='auto'
                                        type='primary'
                                        label='Unlock Early Access!'
                                        icon={Icons.default.offer}
                                        callback={() => handleRedirection('/early-bird-program')}
                                    />
                                </div>
                            </div>
                        </PopupWrapper>
                    }
                </div>
            </div>
        </div>
    )
}

export default Index;