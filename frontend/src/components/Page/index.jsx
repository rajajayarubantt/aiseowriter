import { useState } from 'react';
import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";

/*Assets*/
import Icons from '../../assets/Icons'
import Images from '../../assets/Images'

/*Components*/
import Buttons from "../Buttons";
import { Popconfirm } from 'antd';


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

    const navigator = useNavigate()


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
                            {action.has_no_limit ?
                                <Popconfirm
                                    title="Usage limitation"
                                    description="You have exhausted the the usage with your current plan period."
                                    okText="Upgrade"
                                    showCancel={false}
                                    onConfirm={() => navigator('/upgrade')}
                                >
                                    <button
                                        type={'button'}
                                        key={`${id}-button-main`}
                                        id={`${id}-button-main`}
                                        className={`button button-${action.type} elem-width-${action.width}`}
                                    >
                                        {action.icon &&
                                            <div
                                                dangerouslySetInnerHTML={{ __html: action.icon }}
                                                className="button-icon"
                                            ></div>
                                        }
                                        {action.label && <div className="button-label">{action.label}</div>}

                                    </button>

                                </Popconfirm> :
                                <Buttons
                                    type={action.type}
                                    icon={action.icon}
                                    width={action.width}
                                    label={action.label}
                                    callback={action.callback}
                                />
                            }
                        </div>
                    ))}
                </div>
            }
        </div>
    )

}

export { PageContainer, PageHeader };