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


const UpdateNotionDetails = ({ details, callback = () => { } }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [DataValid, setDataValid] = useState(false)
    const [Form_Data, setForm_Data] = useState({
        page: '',
        post_status: '',
    })

    const RequiredData = {
        page: true,
        post_status: true,
    }
    const [InvalidData, setInvalidData] = useState({
        page: false,
        post_status: false,
    })

    const [PageOptions, setPageOptions] = useState([])

    const [PostStatusOptions, setPostStatusOptions] = useState([
        {
            value: 'draft',
            label: 'Draft',
        },
        {
            value: 'published',
            label: 'Published',
        },
        {
            value: 'scheduled',
            label: 'Scheduled',
        },
    ])


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

        if (details) {
            let pages = details['pages'] || []

            pages = pages?.map(u => {
                return {
                    value: u.id,
                    label: `${u.title}`,
                }
            })


            setPageOptions(pages)

        }

    }, [details])

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
                        <div style={{ fontWeight: 'bold', fontSize: 18 }}>Select Your Page</div>

                    </div>
                }
                open={true}
                onOk={handleSave}
                width={'400px'}
                closeIcon={false}
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
                        id="add-campaign-page"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.page,
                            onChange: (val) => handleInputChange('page', val),
                            options: PageOptions,
                            placeholder: 'Select your page',
                            label: "Page",
                            invalid: InvalidData.page,
                        }}
                    />
                    <Inputs
                        id="add-campaign-post_status"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.post_status,
                            onChange: (val) => handleInputChange('post_status', val),
                            options: PostStatusOptions,
                            placeholder: 'Select Post Status',
                            label: "Post Status",
                            invalid: InvalidData.post_status,
                        }}
                    />

                </InputWrapper>

            </Modal>

        </>
    )
}

export default UpdateNotionDetails;