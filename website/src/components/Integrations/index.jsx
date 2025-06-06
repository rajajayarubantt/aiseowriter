import React from "react";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const Index = () => {

    return (
        <div className="integration-wrapper-main">
            <div className="integration-wrapper-title animation-appear-container">Boost visibility with powerful integrations 🚀</div>
            <div className="integration-wrapper-content animation-appear-container">
                <div className="integration-wrapper-items">
                    {Images.integrations?.map((app, idx) => (
                        <div
                            key={`integration-wrapper-item-${app.label}`}
                            className="integration-wrapper-item"
                        >
                            <img src={app.img} alt={`Integration with ${app.label}`} />
                            <div className="item-label">{app.label}</div>
                        </div>
                    ))}


                </div>
            </div>
        </div>
    )
}

export default Index;