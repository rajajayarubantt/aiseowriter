import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Modal } from 'antd';

/*Assets*/
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Buttons from '../../components/Buttons'

const ConnectWebhook = ({ callback = () => { } }) => {


    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [DataValid, setDataValid] = useState(false)
    const [Form_Data, setForm_Data] = useState({
        webhook_url: '',
        secret_key: '',
    })

    const RequiredData = {
        webhook_url: true,
        secret_key: true,
    }
    const [InvalidData, setInvalidData] = useState({
        webhook_url: false,
        secret_key: false,
    })


    const ValidateForm = (formdata, validoption, setinvalid = true) => {

        let invaliddata = {}

        for (const datakey in formdata) {

            if (
                validoption[datakey] &&
                (
                    formdata[datakey] == ""
                    || formdata[datakey] == null
                )
            ) invaliddata[datakey] = true
        }

        if (setinvalid) setInvalidData({ ...InvalidData, ...invaliddata })

        return invaliddata

    }

    const handleClose = () => {
        if (callback) callback()
    }
    const handleSave = async () => {
        // e.preventDefault()

        let payload = { ...Form_Data }

        let invalidfields = ValidateForm(payload, RequiredData)

        if (Object.keys(invalidfields).length) {
            setWarningAlert(true)
            setWarningAlertType('warning')
            setwarningAlertMessage('Please fill all fields!')

            return
        }

        return callback(payload)

    }
    const handleInputChange = (key, value, opt) => {

        setForm_Data(prev => {
            const updated = { ...prev };
            updated[key] = value;

            return updated;
        });
    };


    useEffect(() => {

    }, [])

    useEffect(() => {
        let payload = { ...Form_Data }

        let invalidfields = ValidateForm(payload, RequiredData, false)

        if (!Object.keys(invalidfields).length) setDataValid(true)

    }, [Form_Data])


    return (
        <>
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
                        callback: () => setWarningAlert(false)
                    }} />
                : null}
            {/* <PopupWrapper> */}
            <Modal
                title={
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: 18 }}>Connect to Webhook</div>

                    </div>
                }
                open={true}
                onOk={handleSave}
                width={'400px'}
                onCancel={handleClose}
                cancelText="Discard"
                centered={true}
                maskClosable={false}
                footer={[
                    <Buttons
                        button_type={"submit"}
                        type={"primary"}
                        width={'max'}
                        label={'Connect'}
                        callback={handleSave}
                        disable={!DataValid}
                        _style={{
                            height: '46px'
                        }}
                    />
                ]}
                styles={{
                    overflowY: 'auto',
                    paddingTop: '16px',
                    paddingRight: '8px',
                }}
            >

                <InputWrapper>

                    <Inputs
                        id="add-campaign-webhook_url"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: 'Your Webhook URL',
                            value: Form_Data.webhook_url,
                            onChange: (val) => handleInputChange('webhook_url', val),
                            label: "POST Webhook URL",
                            invalid: InvalidData.webhook_url,
                        }}
                    />
                    <Inputs
                        id="add-campaign-secret_key"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: 'X-SECRET header',
                            value: Form_Data.secret_key,
                            onChange: (val) => handleInputChange('secret_key', val),
                            label: "X-SECRET Header",
                            invalid: InvalidData.secret_key,
                        }}
                    />



                    <div className="warning-message-container">
                        <strong>Security Note:</strong>Your webhook secret is transmitted securely and never
                        stored in plain text. Rotate secrets regularly for enhanced protection.
                        <br />
                        <br />
                        For more info <a href=""><strong>Read Me</strong></a>
                    </div>

                </InputWrapper>

            </Modal>

        </>
    )
}

export default ConnectWebhook;