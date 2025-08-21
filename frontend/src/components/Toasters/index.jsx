
import { useEffect, useState } from 'react'
import Icons from '../../assets/Icons'
import { message } from 'antd';

const AlertIcons = {
    "warning": Icons.default.warning,
    "success": Icons.default.tick_mark,
    "error": Icons.default.close_mark,
}

const Index = ({ id, props }) => {

    const { type, message: _message, callback, delay } = props


    useEffect(() => {
        message[type](_message)

        setTimeout(() => {
            callback()
        }, 1000)
    }, [])


    return ("")

}

export default Index;