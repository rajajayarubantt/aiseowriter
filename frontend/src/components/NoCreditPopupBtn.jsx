import { useState } from 'react';
import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";

import { Popconfirm } from 'antd';
import Utils from "../helpers/utils";

const NoCreditPopupBtn = ({ id = Utils.getUniqueId(), title, description, type = "default", width = "auto", icon, label = "" }) => {

    const navigator = useNavigate()

    return (
        <Popconfirm
            title={title || "Usage limitation"}
            description={description || "You have exhausted the the usage with your current plan period."}
            okText="Upgrade"
            showCancel={false}
            onConfirm={() => navigator('/upgrade')}
        >
            <button
                type={'button'}
                key={`${id}-button-main`}
                id={`${id}-button-main`}
                className={`button button-${type} elem-width-${width}`}
            >
                {icon &&
                    <div
                        dangerouslySetInnerHTML={{ __html: icon }}
                        className="button-icon"
                    ></div>
                }
                {label && <div className="button-label">{label}</div>}

            </button>

        </Popconfirm>
    )
}

export default NoCreditPopupBtn;