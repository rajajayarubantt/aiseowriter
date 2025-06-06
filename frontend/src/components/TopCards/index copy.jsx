import React, { useState } from 'react';

import CountUp from 'react-countup';

/*Assets*/
import Icons from '../../assets/Icons'

const Index = ({ items = [], callback = () => { } }) => {

    const handleCallback = (item) => {
        if (callback) callback(item)
    }

    return (
        <div className="top-cards-main">
            <div className="top-cards-items">
                {items?.map((card, idx) => (
                    <div
                        key={`card-item-${idx}`}
                        className="top-card-item"
                        onClick={() => handleCallback(card)}
                    >
                        <div className="card-head">
                            <div className="card-head-title">{card.label}</div>
                            {card.icon &&
                                <div className="card-head-icon"
                                    dangerouslySetInnerHTML={{ __html: card.icon }}
                                ></div>
                            }
                        </div>
                        <div className="card-count-main">
                            <CountUp className="count-value" end={card.count} separator="," />
                            {card.count_label && <div className="count-label">{card.count_label}</div>}
                        </div>


                    </div>
                ))}

            </div>
        </div>
    )
}

export default Index