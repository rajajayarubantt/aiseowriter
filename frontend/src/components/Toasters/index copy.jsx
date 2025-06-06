
import { useEffect, useState } from 'react'
import Icons from '../../assets/Icons'


const AlertIcons = {
    "warning": Icons.default.warning,
    "success": Icons.default.tick_mark,
    "error": Icons.default.close_mark,
}

const Index = ({ id, props }) => {

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
                    dangerouslySetInnerHTML={{ __html: AlertIcons[type] }}
                ></div>
                <div className="label">{message}</div>
            </div>
        </div>
    )

}

export default Index;