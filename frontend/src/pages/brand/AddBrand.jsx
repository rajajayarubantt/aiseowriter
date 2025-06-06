import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";
import dayjs from 'dayjs';

/*Components*/
import Buttons from "../../components/Buttons";
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import SectionHead from "../../components/SectionHead";
import PopupWrapper from "../../components/Popup/Wrapper";
import PopupContainer from "../../components/Popup/Container";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import ProfileUpload from '../../components/Inputs/ProfileUpload'

/*Constant Data*/
import Industires_Data from "../../data/industires.json";

/*handler*/
import BrandHandler from '../../handlers/brands/brands'


const AddBrand = ({ type = 'create', callback = () => { } }) => {

    const navigator = useNavigate()
    const brandHandler = new BrandHandler()

    const { id } = useParams()

    const TITLE = `${type == 'edit' ? 'Update' : type == 'create' ? 'Create new' : ''} Brand`

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [Form_Data, setForm_Data] = useState({
        logo: null,
        logo_url: null,
        name: null,
        description: null,
        industry: null,
        category: null,
        brand_template: null,
        website: null,
    })
    const [ReadOnlyData, setReadOnlyData] = useState({
        name: type == 'view',
        description: type == 'view',
        industry: type == 'view',
        category: type == 'view',
        brand_template: type == 'view',
        website: type == 'view',
    })
    const [RequiredData, setRequiredData] = useState({
        name: true,
        description: true,
        industry: true,
        category: true,
        brand_template: false,
        website: true,
    })
    const [InvalidData, setInvalidData] = useState({
        name: false,
        description: false,
        industry: false,
        category: false,
        brand_template: false,
        website: false,
    })

    const getIndustries = () => {
        return Object.keys(Industires_Data).map((i, idx) => {
            return {
                value: i,
                label: i,
            };
        });
    };
    const getCategories = (industry) => {
        if (industry) {
            return Industires_Data[industry].map((i, idx) => {
                return {
                    value: i,
                    label: i,
                };
            });
        } else {
            let categories = [];

            for (const key in Industires_Data) {
                categories.push(
                    ...Industires_Data[key].map((i, idx) => {
                        return {
                            value: i,
                            label: i,
                        };
                    })
                );
            }

            return categories;
        }
    };

    const ValidateForm = (formdata, validoption) => {

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

        setInvalidData({ ...InvalidData, ...invaliddata })

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


        delete payload.logo_url

        const form_payload = new FormData();

        for (const key in payload) form_payload.append(key, payload[key])

        if (type == 'edit') {
            form_payload.append('id', String(id))
        }

        setIsLoading(true)

        let response = {
            success: false,
            message: 'Request failed, Please try again!'
        }

        if (type == 'create') response = await brandHandler.create(form_payload)
        else if (type == 'edit') response = await brandHandler.update(form_payload)

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        return handleClose()
    }

    const ACTIONS = [
        {
            id: 'cancel',
            type: 'default',
            width: 'sm',
            label: 'Discard',
            callback: handleClose
        },
        {
            id: 'save',
            type: 'primary',
            width: 'sm',
            label: 'Save',
            callback: handleSave
        }
    ]

    const handleInputChange = (key, value) => {

        setForm_Data({ ...Form_Data, [key]: value })
    }

    const getBrands = async (filters = {}) => {

        filters = {
            ...filters,
            columns: '*',
        }

        setIsLoading(true)
        let response = await brandHandler.get(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        if (!Array.isArray(response.data) || !response.data.length) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage('Failed to get brand, Please try to re-open!')
        }

        let brand_data = response.data[0]

        setForm_Data({
            logo: Utils.dataURLtoFile(`data:image/png;base64,${brand_data.logo}`, brand_data.name),
            logo_url: `data:image/png;base64,${brand_data.logo}`,
            name: brand_data.name,
            description: brand_data.description,
            industry: brand_data.industry,
            category: brand_data.category,
            brand_template: brand_data.brand_template,
            website: brand_data.website,
        })


    }

    useEffect(() => {
        if (type != 'create' && !id) navigator(-1)
        if (type != 'create' && id) getBrands({ id })
    }, [])


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
                        callback: (confirmation) => setWarningAlert(false)
                    }} />
                : null}
            <PopupWrapper>
                <PopupContainer
                    title={TITLE}
                    desc="automate blog posting with category, brand_template, and description"
                    close_callback={handleClose}
                    actions={type != 'view' ? ACTIONS : []}
                >

                    <ProfileUpload
                        id="upload-brand-logo"
                        width='max'
                        label="Brand Logo"
                        desc="PNG or JPG (max 1MB)"
                        btn_label="Upload logo"
                        image={Form_Data.logo_url}
                        readonly={type == 'view'}
                        callback={(val) => handleInputChange('logo', val)}
                    />


                    <InputWrapper>
                        <Inputs
                            id="add-brand-name"
                            type="text"
                            width='lg'
                            input_props={{
                                type: "text",
                                placeholder: 'Campaign name',
                                readonly: ReadOnlyData.name,
                                value: Form_Data.name,
                                onChange: (val) => handleInputChange('name', val),
                                required: RequiredData.name,
                                label: "Name",
                                invalid: InvalidData.name,
                            }}
                        />
                        <Inputs
                            id="add-brand-description"
                            type="textarea"
                            width='max'
                            input_props={{
                                type: "text",
                                readonly: ReadOnlyData.description,
                                value: Form_Data.description,
                                placeholder: 'Describe your campaign here...',
                                onChange: (val) => handleInputChange('description', val),
                                required: RequiredData.description,
                                label: "Bio",
                                invalid: InvalidData.description,
                            }}
                        />
                    </InputWrapper>

                    <InputWrapper>
                        <Inputs
                            id="add-brand-industry"
                            type="select"
                            width='half'
                            input_props={{
                                readonly: ReadOnlyData.industry,
                                value: Form_Data.industry,
                                onChange: (val) => handleInputChange('industry', val),
                                required: RequiredData.industry,
                                placeholder: 'Select blog industry',
                                options: getIndustries(),
                                label: "Industry",
                                invalid: InvalidData.industry,
                            }}
                        />
                        <Inputs
                            id="add-brand-category"
                            type="select"
                            width='half'
                            input_props={{
                                readonly: ReadOnlyData.category,
                                value: Form_Data.category,
                                onChange: (val) => handleInputChange('category', val),
                                required: RequiredData.category,
                                placeholder: 'Select blog category',
                                options: getCategories(Form_Data.industry),
                                label: "Category",
                                invalid: InvalidData.category,
                            }}
                        />

                    </InputWrapper>
                    <InputWrapper>

                        <Inputs
                            id="add-brand-website"
                            type="text"
                            width='half'
                            input_props={{
                                readonly: ReadOnlyData.website,
                                value: Form_Data.website,
                                placeholder: 'Enter your website url',
                                onChange: (val) => handleInputChange('website', val),
                                required: RequiredData.website,
                                label: "Website URL",
                                invalid: InvalidData.website,
                            }}
                        />
                        <Inputs
                            id="add-brand-brand_template"
                            type="textarea"
                            width='max'
                            input_props={{
                                readonly: ReadOnlyData.brand_template,
                                value: Form_Data.brand_template,
                                placeholder: "This will be added at last in your blog",
                                onChange: (val) => handleInputChange('brand_template', val),
                                required: RequiredData.brand_template,
                                label: "Brand temple",
                                info_tooltip: "This will be added at last in your blog",
                                invalid: InvalidData.brand_template,
                            }}
                        />
                    </InputWrapper>

                </PopupContainer>

            </PopupWrapper>

        </>
    )
}

export default AddBrand;