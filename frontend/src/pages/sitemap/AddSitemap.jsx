import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Modal } from 'antd';

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Buttons from '../../components/Buttons'

/*handler*/
import SitemapHandler from '../../handlers/sitemap/sitemap'

const AddSitemap = ({ callback = () => { } }) => {

    const navigator = useNavigate()
    const sitemapHandler = new SitemapHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [DataValid, setDataValid] = useState(false)
    const [Form_Data, setForm_Data] = useState({
        sitemap_url: '',
    })

    const RequiredData = {
        sitemap_url: true,
    }
    const [InvalidData, setInvalidData] = useState({
        sitemap_url: false,
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
        return navigator(-1)
    }
    const handleSave = async (e) => {
        // e.preventDefault()

        let payload = { ...Form_Data }

        let invalidfields = ValidateForm(payload, RequiredData)

        if (Object.keys(invalidfields).length) {
            setWarningAlert(true)
            setWarningAlertType('warning')
            setwarningAlertMessage('Please fill all fields!')

            return
        }

        setIsLoading(true)

        let response = await sitemapHandler.import(payload)

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        return handleClose()
    }
    const handleInputChange = (key, value, opt) => {

        setForm_Data(prev => {
            const updated = { ...prev };
            updated[key] = value;

            return updated;
        });
    };

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
                        <div style={{ fontWeight: 'bold', fontSize: 18 }}>Add Sitemap</div>

                    </div>
                }
                open={true}
                onOk={handleSave}
                width={'600px'}
                onCancel={handleClose}
                cancelText="Discard"
                centered={true}
                maskClosable={false}
                footer={[
                    <Buttons
                        button_type={"submit"}
                        type={"primary"}
                        width={'max'}
                        label={'Import'}
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
                        id="add-sitemap-sitemap_url"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: 'E.g. https://website/sitemap.xml',
                            value: Form_Data.sitemap_url,
                            onChange: (val) => handleInputChange('sitemap_url', val),
                            required: RequiredData.sitemap_url,
                            label: "Sitemap URL",
                            invalid: InvalidData.sitemap_url,
                        }}
                    />

                    <div className="popup-message-main">
                        Add a sitemap and automatically link your web pages when generating the articles.
                        <div className="message-highlight">
                            Note: Upto 200 URLs from your sitemap are processed for automatic internal linking.
                        </div>
                        <img className="message-image" src={Images.Sitemap} alt="sitemap" />
                    </div>


                </InputWrapper>

            </Modal>

        </>
    )
}

export default AddSitemap;