import React from "react";

/*Component */
import ButtonsWrapper from '../ButtonsWrapper'
import Buttons from '../Buttons'
import BotPatternBG from '../BotPatternBG'

const Index = () => {


    const TraditionalSection = {
        head: {
            icon: '⏳',
            title: 'Traditional + GPT Way',
            tag: '9-12 hours'
        },
        items: [
            {
                head: {
                    icon: '🔍',
                    title: 'Manual Research',
                    tag: '3-4 hours'
                },
                details: [
                    {
                        label: 'Hours spent gathering and organizing data',
                        classess: ''
                    },
                    {
                        label: 'Pain point: Information overload & scattered sources',
                        classess: 'danger-color font-weight-md'
                    },
                ]
            },
            {
                head: {
                    icon: '✏️',
                    title: 'Content Drafting with GPT',
                    tag: '2-3 hours'
                },
                details: [
                    {
                        label: 'Use GPT to generate rough content, then manually edit for tone, SEO, and structure.',
                        classess: ''
                    },
                    {
                        label: 'Pain point: Time-consuming, lacks brand tone and SEO finesse',
                        classess: 'danger-color font-weight-md'
                    },
                ]
            },
            {
                head: {
                    icon: '🎨',
                    title: 'Visual Creation',
                    tag: '4-5 hours'
                },
                details: [
                    {
                        label: 'Pixel-perfect design implementation',
                        classess: ''
                    },
                    {
                        label: 'Pain point: Technical limitations & tool complexity',
                        classess: 'danger-color font-weight-md'
                    },
                ]
            },
        ]
    }
    const AiWaySection = {
        head: {
            icon: '🚀',
            title: 'AI-Powered Way',
            tag: '2 minutes'
        },
        items: [
            {
                head: {
                    icon: '🧠',
                    title: 'Smart Analysis',
                },
                details: [
                    {
                        label: 'Instant data processing & insights',
                    },
                    {
                        label: 'Save 95% research time',
                        classess: 'gradient-purple-color font-weight-md'
                    },
                ]
            },
            {
                head: {
                    icon: '⚡',
                    title: 'Lightning Fast',
                },
                details: [
                    {
                        label: 'Generate in seconds, not hours',
                    },
                    {
                        label: '10x faster creation',
                        classess: 'gradient-yellow-color font-weight-md'
                    },
                ]
            },
            {
                head: {
                    icon: '🎯',
                    title: 'Perfect Accuracy',
                },
                details: [
                    {
                        label: 'Data-driven visual storytelling',
                    },
                    {
                        label: '100% precise visualization',
                        classess: 'gradient-green-color font-weight-md'
                    },
                ]
            },
            {
                head: {
                    icon: '✨',
                    title: 'Creative Freedom',
                },
                details: [
                    {
                        label: 'Unlimited styles & variations',
                        classess: ''
                    },
                    {
                        label: 'Endless possibilities',
                        classess: 'gradient-blue-color font-weight-md'
                    },
                ]
            },
        ]

    }

    return (
        <div className="whysection-wrapper-main">
            <BotPatternBG />
            <div className="whysection-wrapper-container">
                <div className="whysection-wrapper-header">
                    <div className="header-title animation-appear-container">Why use an AI Blog Generator?</div>
                    <div className="header-desc animation-appear-container">Turn brand insights into high-performing blogs instantly. Skip manual writing and cut content costs by 90%.</div>
                    <div className="header-tags animation-appear-container">
                        <div className="tags-item">2-Second Generation</div>
                        <div className="tags-item">Ranks top on Google</div>
                        <div className="tags-item">Auto Publishes Everywhere</div>
                        <div className="tags-item">Zero Manual Effort</div>
                        <div className="tags-item">Cost-Effective</div>
                    </div>
                </div>
                <div className="whysection-wrapper-content">
                    <div className="traditional-main">
                        <div className="traditional-head">
                            <div className="head-title">
                                <div className="icon">{TraditionalSection.head.icon}</div>
                                {TraditionalSection.head.title}
                            </div>
                            <div className="head-tag">{TraditionalSection.head.tag}</div>
                        </div>
                        <div className="traditional-items">
                            {TraditionalSection.items?.map((item, idx) => (
                                <div
                                    key={`traditional-item-${idx}`}
                                    className="traditional-item"
                                >
                                    <div className="content-item-head">
                                        <div className="head-title">
                                            <div className="icon">{item.head.icon}</div>
                                            {item.head.title}
                                        </div>
                                        <div className="head-tag">{item.head.tag}</div>
                                    </div>
                                    <div className="content-item-details">
                                        {item.details?.map((d_item, _idx) => (
                                            <div
                                                key={`traditional-content-item-desc-${idx}-${_idx}`}
                                                className={`content-item-desc ${d_item.classess || ""}`}>{d_item.label}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="aiway-main">
                        <div className="aiway-head">
                            <div className="head-title">
                                <div className="icon">{AiWaySection.head.icon}</div>
                                <div className="label">{AiWaySection.head.title}</div>
                            </div>
                            <div className="head-tag">{AiWaySection.head.tag}</div>
                        </div>
                        <div className="aiway-items">
                            {AiWaySection.items?.map((item, idx) => (
                                <div
                                    key={`aiway-item-${idx}`}
                                    className="aiway-item"
                                >
                                    <div className="content-item-head">
                                        <div className="head-title">
                                            <div className="icon">{item.head.icon}</div>
                                            {item.head.title}
                                        </div>
                                    </div>
                                    <div className="content-item-details">
                                        {item.details?.map((d_item, _idx) => (
                                            <div
                                                key={`aiway-content-item-desc-${idx}-${_idx}`}
                                                className={`content-item-desc ${d_item.classess || ""}`}>{d_item.label}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="aiway-saver">
                            <div className="saver-small">Traditional: $120+</div>
                            <div className="saver-ai">AI: $0.5 per blog</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Index;