
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


/*Assets */
import Icons from '../../assets/Icons'
import Images from '../../assets/Images'

/*Components */
import ButtonsWrapper from '../ButtonsWrapper'
import Buttons from '../Buttons'

const Index = () => {

    const navigator = useNavigate()
    const handleRedirection = (url) => {
        navigator(url)
    }

    const [LinkSections, setLinkSections] = useState([
        {
            id: 'browser',
            title: 'Browser',
            items: [
                // {
                //     id: 'affiliates',
                //     label: 'Affiliates',
                //     url: '/affiliates',
                // },
                {
                    id: 'pricing',
                    label: 'Pricing',
                    url: '/pricing',
                },
                {
                    id: 'blog',
                    label: 'Marketing Guide',
                    url: '/blog',
                },
                // {
                //     id: 'whats-new',
                //     label: `What's new`,
                //     url: '/whats-new',
                // },
                {
                    id: 'early-bird-program',
                    label: 'Get Early Access',
                    url: '/early-bird-program',
                },
            ]
        },
        {
            id: 'legal',
            title: 'Legal',
            items: [
                {
                    id: 'terms-of-use',
                    label: 'Terms of Use',
                    url: '/terms-of-use',
                },
                {
                    id: 'privacy-policy',
                    label: 'Privacy Policy',
                    url: '/privacy-policy',
                },

            ]
        },

    ])

    return (
        <div className="footer-wrapper-main">
            <div className="footer-wrapper-content">
                <div className="content-brand_info">

                    <div className="brand_info-logo-main animation-appear-container">
                        <Link to={'/'} className="brand_info-logo">
                            <img className='logo-img' src={Images.Logo} alt="zenblog logo" />
                            <div className='logo-title'>Ai SEO Writer</div>
                        </Link>
                        <div className="brand_info-desc">Turn Brand Insights into SEO-Optimized Blogs Posting <br /> — Autonomously</div>
                    </div>

                    <ButtonsWrapper
                        classes='animation-appear-container'
                        direction="column"
                        align="start"
                    >

                        <Buttons
                            width='auto'
                            type='primary'
                            icon={Icons.default.rocket}
                            label='Get Early Access!'
                            callback={() => handleRedirection('/early-bird-program')}
                        />
                        {/* <Buttons
                            width='auto'
                            type='default'
                            label='Login'
                        /> */}

                    </ButtonsWrapper>
                </div>
                <div className="content-links-main">
                    {LinkSections?.map((section, s_idx) => (
                        <div
                            key={`links-section-${section.id}-${s_idx}`}
                            className="content-links-section"
                        >
                            <div className="links-section-title animation-appear-container">{section.title}</div>
                            <div className="links-section-items animation-appear-container">
                                {section?.items?.map((item, idx) => (
                                    <a
                                        key={`links-section-item-${section.id}-${item.id}-${idx}`}
                                        className="links-section-item"
                                        href={item.url}
                                    >{item.label}</a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="footer-wrapper-copyright">© 2025 Zenblog. All rights reserved.</div>

        </div>
    )
}

export default Index;