import React from 'react';

/*Assets*/
import Icons from '../../assets/Icons'
import Images from '../../assets/Images'

/*Components*/
import Buttons from "../Buttons";

/*Helpers */
import Utils from "../../helpers/utils";

const PageContainer = ({ id = Utils.getUniqueId(), children }) => {

    return (

        <div
            id={`page-${id}`}
            className="page-container-main"
        >
            {children}
        </div>
    )

}
const PageHeader = ({ id = Utils.getUniqueId(), title = "", desc = "", actions = [] }) => {

    return (

        <div
            id={`page-header-${id}`}
            className="page-header">
            <div className="header-details">
                <div className="details-title">{title}</div>
                {desc && <div className="details-desc">{desc}</div>}
            </div>

            {(actions && actions.length > 0) &&
                <div className="header-actions">
                    {actions.map((action, idx) => (
                        <div
                            key={`page-header-action-${id}-${idx}`}
                            className="header-action-button"
                        >
                            <Buttons
                                type={action.type}
                                icon={action.icon}
                                width={action.width}
                                label={action.label}
                                callback={action.callback}
                            />
                        </div>
                    ))}
                </div>
            }
        </div>
    )

}

export { PageContainer, PageHeader };