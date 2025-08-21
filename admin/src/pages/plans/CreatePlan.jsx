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

/*handler*/
import PlansHandler from '../../handlers/plans/plans'


const CreatePlan = ({ callback = () => { } }) => {

    const { id } = useParams()

    const navigator = useNavigate()
    const plansHandler = new PlansHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [DataValid, setDataValid] = useState(false)
    const [Form_Data, setForm_Data] = useState({
        keywords_count: 0,
        blog_count: 0,
        name: "",
        monthly_plan_id: "",
        yearly_plan_id: "",
        sitemap_count: 0,
        image_count: 0,
        users_count: 0,
        monthly_price: 0,
        status: 0,
        recommended: false,
        is_freeplan: false,
        features: [],
    })

    const RequiredData = {
        keywords_count: true,
        blog_count: true,
        name: true,
        monthly_plan_id: true,
        yearly_plan_id: true,
        sitemap_count: true,
        image_count: true,
        users_count: true,
        monthly_price: true,
        status: true,
        recommended: false,
        is_freeplan: false,
        features: true,
    }
    const [InvalidData, setInvalidData] = useState({
        keywords_count: false,
        blog_count: false,
        name: false,
        monthly_plan_id: false,
        yearly_plan_id: false,
        sitemap_count: false,
        image_count: false,
        users_count: false,
        monthly_price: false,
        status: false,
        recommended: false,
        is_freeplan: false,
        features: false,
    })

    const StatusOptions = [
        {
            value: "0",
            label: 'In Active'
        },
        {
            value: "1",
            label: 'Active'
        },

    ]
    const RecommendedOptions = [
        {
            value: false,
            label: 'No'
        },
        {
            value: true,
            label: 'Yes'
        },

    ]



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

        setIsLoading(true)

        let response = {
            success: false,
            message: 'Request failed, Please try again'
        }

        if (id) {
            payload.id = id
            response = await plansHandler.update(payload)
        }
        else {
            response = await plansHandler.create(payload)
        }

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        handleClose()
    }

    const handleInputChange = (key, value) => {

        setForm_Data({ ...Form_Data, [key]: value })
    }

    const getPlan = async (id) => {

        let response = await plansHandler.get({ id })

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let {
            keywords_count,
            blog_count,
            name,
            monthly_plan_id,
            yearly_plan_id,
            sitemap_count,
            image_count,
            users_count,
            monthly_price,
            status,
            recommended,
            is_freeplan,
            features,
        } = response.data[0]


        setForm_Data({
            keywords_count,
            blog_count,
            name,
            monthly_plan_id,
            yearly_plan_id,
            sitemap_count,
            image_count,
            users_count,
            monthly_price,
            status,
            recommended,
            is_freeplan,
            features,
        })
    }

    useEffect(() => {
        if (id) getPlan(id)
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
                        <div style={{ fontWeight: 'bold', fontSize: 18 }}>{id ? 'Update Plan' : 'Create New Plan'}</div>
                        <div style={{ fontSize: 15, fontWeight: '400', color: '#888' }}>
                        </div>
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
                        icon={Icons.default.plans}
                        width={'max'}
                        label={id ? 'Update Plan' : 'Create Plan'}
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
                        id="add-plan-name"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: 'Plan Name',
                            value: Form_Data.name,
                            onChange: (val) => handleInputChange('name', val),
                            label: "Plan Name",
                            invalid: InvalidData.name,
                        }}
                    />
                    <Inputs
                        id="add-plan-monthly_plan_id"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: 'Monthly Plan ID',
                            value: Form_Data.monthly_plan_id,
                            onChange: (val) => handleInputChange('monthly_plan_id', val),
                            label: "Monthly Plan ID",
                            invalid: InvalidData.monthly_plan_id,
                        }}
                    />
                    <Inputs
                        id="add-plan-yearly_plan_id"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: 'Yearly Plan ID',
                            value: Form_Data.yearly_plan_id,
                            onChange: (val) => handleInputChange('yearly_plan_id', val),
                            label: "Yearly Plan ID",
                            invalid: InvalidData.yearly_plan_id,
                        }}
                    />
                    <Inputs
                        id="add-plan-blog_count"
                        type="text"
                        width='xs'
                        input_props={{
                            type: "number",
                            placeholder: 'Blog Count',
                            value: Form_Data.blog_count,
                            onChange: (val) => handleInputChange('blog_count', val),
                            label: "Blog count",
                            invalid: InvalidData.blog_count,
                        }}
                    />
                    <Inputs
                        id="add-plan-image_count"
                        type="text"
                        width='xs'
                        input_props={{
                            type: "number",
                            placeholder: 'Image Count',
                            value: Form_Data.image_count,
                            onChange: (val) => handleInputChange('image_count', val),
                            label: "Image count",
                            invalid: InvalidData.image_count,
                        }}
                    />
                    <Inputs
                        id="add-plan-sitemap_count"
                        type="text"
                        width='xs'
                        input_props={{
                            type: "number",
                            placeholder: 'Sitemap Count',
                            value: Form_Data.sitemap_count,
                            onChange: (val) => handleInputChange('sitemap_count', val),
                            label: "Sitemap count",
                            invalid: InvalidData.sitemap_count,
                        }}
                    />
                    <Inputs
                        id="add-plan-keywords_count"
                        type="text"
                        width='half'
                        input_props={{
                            type: "number",
                            placeholder: 'Keywords Count',
                            value: Form_Data.keywords_count,
                            onChange: (val) => handleInputChange('keywords_count', val),
                            label: "Keywords count",
                            invalid: InvalidData.keywords_count,
                        }}
                    />
                    <Inputs
                        id="add-plan-users_count"
                        type="text"
                        width='half'
                        input_props={{
                            type: "number",
                            placeholder: 'Users Count',
                            value: Form_Data.users_count,
                            onChange: (val) => handleInputChange('users_count', val),
                            label: "Users count",
                            invalid: InvalidData.users_count,
                        }}
                    />
                    <Inputs
                        id="add-plan-monthly_price"
                        type="text"
                        width='max'
                        input_props={{
                            type: "number",
                            placeholder: 'Monthly Price',
                            value: Form_Data.monthly_price,
                            onChange: (val) => handleInputChange('monthly_price', val),
                            label: "Monthly Price",
                            invalid: InvalidData.monthly_price,
                        }}
                    />
                    <Inputs
                        id="add-plan-features"
                        type="tags"
                        width='max'
                        input_props={{
                            placeholder: 'Please Enter to input another one',
                            value: Form_Data.features,
                            onChange: (val) => handleInputChange('features', val),
                            label: "Features",
                            invalid: InvalidData.features,
                            info_tooltip: "Enter features"
                        }}
                    />
                    <Inputs
                        id="add-plan-is_freeplan"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.is_freeplan,
                            onChange: (val) => handleInputChange('is_freeplan', val),
                            options: RecommendedOptions,
                            has_option_icon: true,
                            placeholder: 'Select free plan',
                            label: "Free Plan?",
                            invalid: InvalidData.is_freeplan,
                        }}
                    />
                    <Inputs
                        id="add-plan-recommended"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.recommended,
                            onChange: (val) => handleInputChange('recommended', val),
                            options: RecommendedOptions,
                            has_option_icon: true,
                            placeholder: 'Select recommended',
                            label: "Recommended",
                            invalid: InvalidData.recommended,
                        }}
                    />
                    <Inputs
                        id="add-plan-status"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.status,
                            onChange: (val) => handleInputChange('status', val),
                            options: StatusOptions,
                            has_option_icon: true,
                            placeholder: 'Select plan status',
                            label: "Status",
                            invalid: InvalidData.status,
                        }}
                    />


                </InputWrapper>

            </Modal>

        </>
    )
}

export default CreatePlan;