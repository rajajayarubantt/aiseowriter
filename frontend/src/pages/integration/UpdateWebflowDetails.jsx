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


const UpdateWebflowDetails = ({ details, callback = () => { } }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [DataValid, setDataValid] = useState(false)
    const [Form_Data, setForm_Data] = useState({
        site: '',
        post_status: '',
        cms: '',
        content: '',
        cover_image: '',
    })

    const RequiredData = {
        site: true,
        post_status: true,
        cms: true,
        content: true,
        cover_image: true,
    }
    const [InvalidData, setInvalidData] = useState({
        site: false,
        post_status: false,
        cms: false,
        content: false,
        cover_image: false,
    })

    const [SitesOptions, setSitesOptions] = useState([])
    const [CMSOptions_Original, setCMSOptions_Original] = useState([])
    const [CMSOptions, setCMSOptions] = useState([])

    const [CMSchema_Original, setCMSchema_Original] = useState([])
    const [CMSchemaOptions, setCMSchemaOptions] = useState([])

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


        if (key == 'site') {
            setCMSOptions(CMSOptions_Original.filter(option => option.site_id === value))
        }
        else if (key == 'cms') {
            setCMSchemaOptions(CMSchema_Original[value])
        }

        setForm_Data(prev => {
            const updated = { ...prev };
            updated[key] = value;

            return updated;
        });
    };


    useEffect(() => {

        if (details) {
            let { sites, collections, collectionsSchemas } = details

            sites = sites?.map(u => {
                return {
                    value: u.id,
                    label: u.displayName,
                }
            })
            collections = collections?.map(u => {
                return {
                    value: u.id,
                    label: u.displayName,
                    site_id: u.site_id,
                    slug: u.slug,
                }
            })

            let cmsSchemas = []

            collectionsSchemas?.forEach(cms => {

                cmsSchemas[cms.id] = cms.fields.filter(f => !['name', 'slug'].includes(f.slug)).map(field => {

                    return {
                        id: field.id,
                        value: field.slug,
                        label: field.displayName
                    }
                })
            })

            setSitesOptions(sites)
            setCMSOptions_Original(collections)
            setCMSchema_Original(cmsSchemas)
            setCMSOptions(collections)
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
                        <div style={{ fontWeight: 'bold', fontSize: 18 }}>Connect to Webflow</div>

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
                        id="add-campaign-site"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.site,
                            onChange: (val) => handleInputChange('site', val),
                            options: SitesOptions,
                            placeholder: 'Select your site',
                            label: "Site",
                            invalid: InvalidData.site,
                        }}
                    />
                    <Inputs
                        id="add-campaign-cms"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.cms,
                            onChange: (val) => handleInputChange('cms', val),
                            options: CMSOptions,
                            placeholder: 'Select a collection',
                            label: "Collection",
                            invalid: InvalidData.cms,
                        }}
                    />
                    <Inputs
                        id="add-campaign-cms-content"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.content,
                            onChange: (val) => handleInputChange('content', val),
                            options: CMSchemaOptions,
                            placeholder: 'Select schema',
                            label: "Content",
                            invalid: InvalidData.content,
                        }}
                    />
                    <Inputs
                        id="add-campaign-cms-cover_image"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.cover_image,
                            onChange: (val) => handleInputChange('cover_image', val),
                            options: CMSchemaOptions,
                            placeholder: 'Select schema',
                            label: "Cover image",
                            invalid: InvalidData.cover_image,
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

export default UpdateWebflowDetails;