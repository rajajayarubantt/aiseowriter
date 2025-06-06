import React, { useState } from "react";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'


import ButtonsWrapper from '../ButtonsWrapper'
import Buttons from '../Buttons'

const Index = ({ title = "", desc = "", discount = "", pricing_items = [] }) => {

    const [DurationItems, setDurationItems] = useState([
        {
            id: 'monthly',
            label: 'Monthly',
        },
        {
            id: 'yearly',
            label: 'Yearly',
            save: 'save up to 50%'
        },
    ])
    const [ActiveDuration, setActiveDuration] = useState('yearly')


    const [PricingItems, setPricingItems] = useState(pricing_items)

    const handleActiveDuration = (duration) => (
        setActiveDuration(duration)
    )

    return (
        <div className="pricing-wrapper-main">
            <div className="pricing-wrapper-content">
                <div className="pricing-wrapper-header">
                    <div className="header-title animation-appear-container">{title}</div>
                    {desc && <div className="header-desc animation-appear-container">{desc}</div>}
                    {(ActiveDuration == 'yearly' && discount) && <div className="header-discount animation-appear-container">{discount}</div>}
                </div>
                <div className="pricing-wrapper-duration_switch animation-appear-container">
                    {DurationItems?.map((item, idx) => (
                        <div
                            key={`duration_switch-item-${item.id}-${idx}`}
                            className={`duration_switch-item ${ActiveDuration == item.id && 'duration_switch-item-active'}`}
                            onClick={() => handleActiveDuration(item.id)}
                        >
                            <div className="label">{item.label}</div>
                            {item.save &&
                                <div className="save">
                                    <div className="save-icon"
                                        dangerouslySetInnerHTML={{ __html: Icons.default.curve_leftup_arrow }}
                                    ></div>
                                    <div className="save-label">{item.save}</div>
                                </div>
                            }
                        </div>
                    ))}
                </div>
                <div className="pricing-wrapper-items">
                    <div className="content-items">
                        {PricingItems?.map((item, idx) => (
                            <div
                                key={`pricing-item-${idx}`}
                                className={`content-item ${item.recommented && 'content-item-active'} animation-appear-container`}
                            >
                                <div className="content-item-header">
                                    <div className="header-label">{item.header_label}</div>
                                    {item.header_tag && <div className={`header-tag ${item.recommented && 'tag-active'}`}>{item.header_tag}</div>}
                                </div>
                                <div className="content-item-price">
                                    <div className="price-details">
                                        <div className="item-price-amount">{item.amount[ActiveDuration]}</div>
                                        <div className="item-price-label">{!item.free_plan ? '/ pre month' : '/ one time'}</div>
                                    </div>
                                    {!item.free_plan && <div className="price-billed_label">Billed {ActiveDuration}</div>}
                                </div>

                                <div className="content-item-start_button">
                                    <ButtonsWrapper>
                                        <Buttons
                                            width='max'
                                            type={item.recommented ? 'primary' : 'default'}
                                            label='Get Early Access!'
                                            callback={() => item.callback(ActiveDuration, item.id)}
                                        />
                                    </ButtonsWrapper>
                                </div>
                                <div className="content-item-features">
                                    {item.features_title && <div className="features-title">{item.features_title}</div>}
                                    <div className="features-items">
                                        {item.features?.map((feature, _idx) => (
                                            <div
                                                key={`pricing-item-${idx}-feature-${_idx}`}
                                                className="features-item"
                                            >
                                                <div className="item-icon"
                                                    dangerouslySetInnerHTML={{ __html: Icons.default.tick_mark }}
                                                ></div>
                                                <div className="item-label">{feature}</div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;