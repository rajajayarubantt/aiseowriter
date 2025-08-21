import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import ActionDropdown from "../../components/ActionDropdown";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Buttons from '../../components/Buttons'
import { PageContainer, PageHeader } from '../../components/Page'


/*handler*/
import SubscriptionsHandler from '../../handlers/subscriptions/subscriptions'

const Index = () => {

    const [searchParams] = useSearchParams();


    const navigator = useNavigate()
    const subscriptionsHandler = new SubscriptionsHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")



    const subscribe = async () => {
        const params = ['subscription_id', 'status']
        const getParams = (key) => searchParams.get(key)


        const params_data = {}

        params.forEach((param, idx) => {
            params_data[param] = getParams(param)
        })

        console.log(params_data, 'params_data');



        setIsLoading(true)
        let response = await subscriptionsHandler.subscribe(params_data)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        navigator('/')
    }


    useEffect(() => {
        subscribe()
    }, [])


    return (<>
        {isLoading ?

            <Loaders
                props={{
                    isLabel: true
                }} />
            : null}
        {warningAlert ?

            <Toasters
                props={{
                    type: warningAlertType,
                    message: warningAlertMessage,
                    callback: (confirmation) => setWarningAlert(false)
                }} />
            : null}

    </>);
};

export default Index;
