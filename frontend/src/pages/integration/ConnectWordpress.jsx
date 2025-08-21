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

const ConnectWordpress = ({ callback = () => { } }) => {


    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [DataValid, setDataValid] = useState(false)
    const [Form_Data, setForm_Data] = useState({
        site_url: '',
        username: '',
        password: '',
    })

    const RequiredData = {
        site_url: true,
        username: true,
        password: true,
    }
    const [InvalidData, setInvalidData] = useState({
        site_url: false,
        username: false,
        password: false,
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
                        <div style={{ fontWeight: 'bold', fontSize: 18 }}>Connect to WordPress</div>

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
                        id="add-campaign-site_url"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: 'https://yoursite.com',
                            value: Form_Data.site_url,
                            onChange: (val) => handleInputChange('site_url', val),
                            label: "Site URL",
                            invalid: InvalidData.site_url,
                        }}
                    />
                    <Inputs
                        id="add-campaign-username"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: 'Your WordPress username',
                            value: Form_Data.username,
                            onChange: (val) => handleInputChange('username', val),
                            label: "Username",
                            invalid: InvalidData.username,
                        }}
                    />
                    <Inputs
                        id="add-campaign-password"
                        type="password"
                        width='max'
                        input_props={{
                            type: "password",
                            placeholder: 'Your WordPress password',
                            value: Form_Data.password,
                            onChange: (val) => handleInputChange('password', val),
                            label: "Password",
                            invalid: InvalidData.password,
                        }}
                    />


                    <div className="warning-message-container">
                        <strong>Security Note:</strong> Your credentials are transmitted securely
                        and not stored in plain text. Consider using Application
                        Passwords for enhanced security.
                    </div>

                </InputWrapper>

            </Modal>

        </>
    )
}

export default ConnectWordpress;