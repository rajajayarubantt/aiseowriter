import React from "react";


const Index = ({ classes = "", type = 'fullsreen', image = null, _video = null }) => {

    return (
        (image || _video) &&
        <div className={`product-demo-main ${classes} product-${type || 'fullsreen'}-demo`}>
            {image &&
                <img
                    src={image}
                    alt="product-demo-gif" />
            }
            {_video &&
                <video
                    controls={false}
                    loop
                >
                    <source src={_video} type="video/mp4"></source>
                </video>
            }
        </div>
    )
}

export default Index;