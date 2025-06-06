import React from "react";


const Index = ({ classes = "", title = "", images = [] }) => {

    return (
        !title && !images.length ? '' :
            <div className={`companies-wrapper ${classes}`}>
                <div className="companies-wrapper-title">{title}</div>
                <div className="companies-wrapper-content">
                    <div className="companies-wrapper-items">
                        {images?.map((image, idx) => (
                            <img
                                key={`companies-wrapper-item-${idx}`}
                                src={image}
                                alt={`companies-${idx}`}
                                className="companies-wrapper-item"
                            />
                        ))}
                    </div>
                </div>
            </div>

    )
}

export default Index;