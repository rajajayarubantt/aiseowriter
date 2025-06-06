import React, { useState } from "react";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'


const Index = ({ subtitle = "", title = "", desc = "", items = [] }) => {


    const [ActiveItem, setActiveItem] = useState(0)
    const [FAQ_Items, setFAQ_Items] = useState(items)

    const handleFAQItem = (idx) => {

        if (ActiveItem == idx) setActiveItem(null)
        else setActiveItem(idx)

    }

    return (
        <div className="faq-wrapper-main">
            <div className="faq-wrapper-header">
                {subtitle && <div className="header-subtitle">{subtitle}</div>}
                <div className="header-title animation-appear-container">{title}</div>
                <div className="header-desc animation-appear-container">{desc}</div>
            </div>

            <div className="faq-wrapper-questions">
                <div className="questions-items">
                    {FAQ_Items?.map((item, idx) => (
                        <div
                            key={`faq-questions-item-${idx}`}
                            className={`questions-item ${ActiveItem == idx ? 'questions-item-active' : ''} animation-appear-container`}
                            onClick={() => handleFAQItem(idx)}
                        >
                            <div className="questions-item-head">
                                <div className="head-title">{item.question}</div>
                                <div className="head-icon"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.dropdown_arrow }}
                                ></div>
                            </div>
                            <div className="questions-item-content">
                                <div className="content-answer">{item.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Index;