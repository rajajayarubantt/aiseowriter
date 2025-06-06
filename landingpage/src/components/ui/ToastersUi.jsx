
'use client';

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';


const AlertIcons = {
    "warning": <AlertTriangle />,
    "success": <CheckCircle />,
    "error": <XCircle />,
}

const ToastersUi = ({ props }) => {

    const { type, message, callback, delay } = props
    const [hidePopup, setHidePopup] = useState(false)


    useEffect(() => {

        setTimeout(() => {
            setHidePopup(true)
        }, delay ? delay : 3000)
        setTimeout(() => {
            callback(false)
        }, delay ? delay + 1000 : 4000)

    }, [])


    return (
        <div className={`alert-tost-popup-main alert-tost-${type} ${hidePopup ? 'hide-alert-tost-popup-main' : ''}`} >
            <div className="alert-tost-popup-content">
                <div
                    className="icon"
                >
                    {AlertIcons[type]}
                </div>

                <div className="label">{message}</div>
            </div>
        </div>
    )

}

export default ToastersUi;