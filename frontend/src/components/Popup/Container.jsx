import React from "react";

/*Assets*/
import Icons from "../../assets/Icons";

/*Components*/
import Buttons from "../Buttons";

const Container = ({
    title = "",
    desc = "",
    has_header = true,
    has_close = true,
    _style = {},
    close_callback = () => { },
    actions = [],
    children
}) => {

    return (
        <div
            className="popup-container-main"
            style={_style}
        >
            {has_header && <div className="popup-container-header">
                <div className="header-details">
                    {title && <div className="header-details-title">{title}</div>}
                    {desc && <div className="header-details-desc">{desc}</div>}
                </div>
                {has_close && <div onClick={close_callback} className="header-close" dangerouslySetInnerHTML={{ __html: Icons.default.close_x }}></div>}
            </div>}
            <div className="popup-container-content">
                <div className="container-content-main">
                    {children}
                </div>
            </div>
            {actions.length > 0 &&
                <div className="popup-container-footer">
                    {actions?.map((action, idx) => <Buttons {...action} />)}
                </div>
            }
        </div>
    )

}

export default Container;