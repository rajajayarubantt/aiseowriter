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

/*Constant Data*/
import { LanguagesData } from '../../data/data'

/*handler*/
import ArticlesHandler from '../../handlers/articles/articles'
import BrandHandler from '../../handlers/brands/brands'


const CreateArticle = ({ callback = () => { } }) => {

    const navigator = useNavigate()
    const articlesHandler = new ArticlesHandler()
    const brandHandler = new BrandHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [DataValid, setDataValid] = useState(false)
    const [Form_Data, setForm_Data] = useState({
        cover_image: 'none',
        brand_id: null,
        description: null,
        language: "English (US)",
        keywords: [],
    })

    const RequiredData = {
        cover_image: true,
        brand_id: false,
        description: false,
        language: true,
        keywords: true,
    }
    const [InvalidData, setInvalidData] = useState({
        cover_image: false,
        brand_id: false,
        description: false,
        language: false,
        keywords: false,
    })

    const [BrandOptions, setBrandOptions] = useState([])

    const CoverImageOptions = [
        {
            value: 'none',
            label: 'None (no cover image)'
        },
        {
            value: 'unsplash',
            label: 'From Unsplash'
        },
        {
            value: 'infography',
            label: 'Infography'
        },
        {
            value: 'ai-1:1',
            label: 'Generate by AI 1:1'
        },
        {
            value: 'ai-16:9',
            label: 'Generate by AI 16:9'
        },

    ]

    const getLanguages = () => {
        return LanguagesData.map((l, idx) => {
            return {
                value: l.label,
                label: l.label,
                icon: l.icon
            };
        });
    };

    const ValidateForm = (formdata, validoption, setinvalid = true) => {

        let invaliddata = {}

        for (const datakey in formdata) {

            if (
                validoption[datakey] &&
                (
                    formdata[datakey] == ""
                    || formdata[datakey] == null
                    || (datakey == 'keywords' && (!Array.isArray(formdata[datakey]) || !formdata[datakey].length))
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

        let response = await articlesHandler.generate_title(payload)

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        const { id } = response.data

        return navigator(`/article/${id}`)
    }

    const handleInputChange = (key, value) => {

        setForm_Data({ ...Form_Data, [key]: value })
    }

    const getBrands = async () => {

        const filters = {
            columns: 'id,name,logo'
        }

        let response = await brandHandler.get(filters)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let brand_datas = response.data || []

        brand_datas = brand_datas?.map(d => {

            let option = {
                value: d.id,
                label: d.name,
            }

            if (d.logo) option.img = `data:image/png;base64,${d.logo}`
            else option.icon = Icons.default.brand

            return option
        })


        setBrandOptions(brand_datas)


    }
    useEffect(() => {
        getBrands()

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
                        <div style={{ fontWeight: 'bold', fontSize: 18 }}>Generate Article Title from Keywords</div>
                        <div style={{ fontSize: 15, fontWeight: '400', color: '#888' }}>
                            Add keyword(s) and provide a brief topic idea for AI to begin with.
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
                        icon={Icons.default.glow}
                        width={'max'}
                        label={'Generate Title'}
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
                        id="add-campaign-keywords"
                        type="tags"
                        width='max'
                        input_props={{
                            placeholder: 'Please Enter to input another one',
                            value: Form_Data.keywords,
                            onChange: (val) => handleInputChange('keywords', val),
                            label: "Keywords",
                            invalid: InvalidData.keywords,
                            info_tooltip: "Enter keywords or pick up keywords from your saved list."
                        }}
                    />
                    <Inputs
                        id="add-campaign-description"
                        type="text"
                        width='max'
                        input_props={{
                            type: "text",
                            placeholder: '1~2 sentences of few words',
                            value: Form_Data.description,
                            onChange: (val) => handleInputChange('description', val),
                            label: "What to write? (optional)",
                            invalid: InvalidData.description,
                        }}
                    />
                    <Inputs
                        id="add-campaign-brand"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.brand_id,
                            onChange: (val) => handleInputChange('brand_id', val),
                            options: BrandOptions,
                            has_option_icon: true,
                            placeholder: 'Select your brand',
                            label: "Choose your Brand",
                            invalid: InvalidData.brand_id,
                        }}
                    />
                    <Inputs
                        id="add-campaign-cover_image"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.cover_image,
                            onChange: (val) => handleInputChange('cover_image', val),
                            options: CoverImageOptions,
                            placeholder: 'No cover image',
                            label: "Cover image",
                            invalid: InvalidData.cover_image,
                        }}
                    />
                    <Inputs
                        id="add-campaign-language"
                        type="select"
                        width='max'
                        input_props={{
                            value: Form_Data.language,
                            onChange: (val) => handleInputChange('language', val),
                            options: getLanguages(),
                            has_option_icon: true,
                            placeholder: 'Select blog language',
                            label: "Language",
                            invalid: InvalidData.language,
                        }}
                    />

                </InputWrapper>

            </Modal>

        </>
    )
}

export default CreateArticle;