import React from "react";


const Index = ({ title = "", images = [] }) => {

    return (
        !title && !images.length ? '' :
            <div className="creators-wrapper">
                <div className="creators-wrapper-title">{title}</div>
                <div className="creators-wrapper-items">
                    {images?.map((image, idx) => (
                        <img
                            key={`creators-wrapper-item-${idx}`}
                            src={image}
                            alt={`creators-${idx}`}
                            className="creators-wrapper-item"
                        />
                    ))}
                </div>
            </div>

    )
}

export default Index;