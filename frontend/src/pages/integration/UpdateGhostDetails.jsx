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


const UpdateGhostDetails = ({ details, callback = () => { } }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [DataValid, setDataValid] = useState(false)
    const [Form_Data, setForm_Data] = useState({
        domain: '',
        post_status: '',
        tag: '',
        author: '',
        post_access: '',
    })

    const RequiredData = {
        domain: true,
        post_status: true,
        tag: true,
        author: true,
        post_access: true,
    }
    const [InvalidData, setInvalidData] = useState({
        domain: false,
        post_status: false,
        tag: false,
        author: false,
        post_access: false,
    })

    const [DomainOptions, setDomainOptions] = useState([])
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
    const [PostAccessOptions, setPostAccessOptions] = useState([
        {
            value: 'public',
            label: 'Public',
        },
        {
            value: 'members',
            label: 'Members',
        },
        {
            value: 'paid',
            label: 'Paid',
        },
    ])
    const [TagOptions, setTagsOtions] = useState([])
    const [AuthorOptions, setAuthorOptions] = useState([])

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
            let { site, users, tags } = details

            users = users?.map(u => {
                return {
                    value: u.id,
                    label: u.name,
                }
            })
            tags = tags?.map(u => {
                return {
                    value: u.id,
                    label: u.name,
                }
            })
            let domains = [
                {
                    value: site.url,
                    label: site.url,
                }
            ]

            setDomainOptions(domains)
            setTagsOtions(tags)
            setAuthorOptions(users)
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
                        <div style={{ fontWeight: 'bold', fontSize: 18 }}>Connect to Ghost</div>

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
                        id="add-campaign-domain"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.domain,
                            onChange: (val) => handleInputChange('domain', val),
                            options: DomainOptions,
                            placeholder: 'Select your domain',
                            label: "Ghost blog domain",
                            invalid: InvalidData.domain,
                        }}
                    />
                    <Inputs
                        id="add-campaign-tag"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.tag,
                            onChange: (val) => handleInputChange('tag', val),
                            options: TagOptions,
                            placeholder: 'Select a tag',
                            label: "Select a Tag",
                            invalid: InvalidData.tag,
                        }}
                    />
                    <Inputs
                        id="add-campaign-author"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.author,
                            onChange: (val) => handleInputChange('author', val),
                            options: AuthorOptions,
                            placeholder: 'Select an Author',
                            label: "Select an Author",
                            invalid: InvalidData.author,
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
                    <Inputs
                        id="add-campaign-post_access"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.post_access,
                            onChange: (val) => handleInputChange('post_access', val),
                            options: PostAccessOptions,
                            placeholder: 'Select Post Access',
                            label: "Post Access",
                            invalid: InvalidData.post_access,
                        }}
                    />

                </InputWrapper>

            </Modal>

        </>
    )
}

export default UpdateGhostDetails;