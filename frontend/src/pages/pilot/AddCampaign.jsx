import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Modal, Form, Input } from 'antd';

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";
import dayjs from 'dayjs';

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import SectionHead from "../../components/SectionHead";
import PopupWrapper from "../../components/Popup/Wrapper";
import PopupContainer from "../../components/Popup/Container";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'

/*Constant Data*/
import Languages_Data from "../../data/languages.json";
import Industires_Data from "../../data/industires.json";

/*handler*/
import SchedulesHandler from '../../handlers/schedules/schedules'
import BrandHandler from '../../handlers/brands/brands'

const TIME_FORMAT = 'HH:mm';

const AddCampaign = ({ type = 'create', callback = () => { } }) => {

    const navigator = useNavigate()
    const schedulesHandler = new SchedulesHandler()
    const brandHandler = new BrandHandler()

    const { id } = useParams()

    const TITLE = `${type == 'edit' ? 'Update' : type == 'create' ? 'Add new' : ''} Campaign`

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [MAX_POSTS, setMAX_POSTS] = useState(5)

    const [Form_Data, setForm_Data] = useState({
        name: null,
        brand_id: null,
        description: null,
        industry: null,
        category: null,
        language: null,
        daterange: null,
        days: null,
        posts: [
            {
                id: 1,
                time: null,
                description: null
            }
        ],
        keywords: null,
        tone: null,
        media: null,
        call_to_action: null,
    })
    const [ReadOnlyData, setReadOnlyData] = useState({
        name: type == 'view',
        brand_id: type == 'view',
        description: type == 'view',
        industry: type == 'view',
        category: type == 'view',
        language: type == 'view',
        daterange: type == 'view',
        posts: type == 'view',
        days: type == 'view',
        keywords: type == 'view',
        tone: type == 'view',
        media: type == 'view',

        call_to_action: type == 'view',
    })
    const [RequiredData, setRequiredData] = useState({
        name: true,
        brand_id: false,
        description: false,
        industry: true,
        category: true,
        language: true,
        daterange: true,
        posts: true,
        days: true,
        keywords: true,
        tone: false,
        media: true,

        call_to_action: false,
    })
    const [InvalidData, setInvalidData] = useState({
        name: false,
        brand_id: false,
        description: false,
        industry: false,
        category: false,
        language: false,
        daterange: false,
        posts: false,
        days: false,
        keywords: false,
        tone: false,
        media: false,

        call_to_action: false,
    })

    const [BrandOptions, setBrandOptions] = useState([])

    const [DurationDaysOptions, setDurationDaysOptions] = useState([
        {
            value: 'all',
            label: 'All'
        },
        {
            value: 'Sunday',
            label: 'Sunday'
        },
        {
            value: 'Monday',
            label: 'Monday'
        },
        {
            value: 'Tuesday',
            label: 'Tuesday'
        },
        {
            value: 'Wednesday',
            label: 'Wednesday'
        },
        {
            value: 'Thursday',
            label: 'Thursday'
        },
        {
            value: 'Friday',
            label: 'Friday'
        },
        {
            value: 'Saturday',
            label: 'Saturday'
        },
    ])
    const [ToneOptions, setToneOptions] = useState([
        {
            value: 'auto',
            label: 'Auto'
        },
        {
            value: 'Professional',
            label: '😎 Professional'
        },
        {
            value: 'Funny!',
            label: '😂 Funny!'
        },
        {
            value: 'Casual',
            label: '😌 Casual'
        },
        {
            value: 'Excited',
            label: '🤩 Excited'
        },
        {
            value: 'Witty',
            label: '😆 Witty'
        },
        {
            value: 'Bold',
            label: '⚡ Bold'
        },
        {
            value: 'Dramatic',
            label: '🎭 Dramatic'
        },
        {
            value: 'Grumpy',
            label: '😤 Grumpy'
        },
        {
            value: 'Secretive',
            label: '🤫 Secretive'
        },

    ])
    const [MediaOptions, setMediaOptions] = useState([
        {
            value: 'all',
            label: 'All'
        },
        {
            value: 'linkedin',
            label: 'Linkedin'
        },
        {
            value: 'instagram',
            label: 'Instagram'
        },
        {
            value: 'website_blog',
            label: 'Website Blog'
        },

    ])

    const getLanguages = () => {
        return Languages_Data.map((l, idx) => {
            return {
                value: l,
                label: l,
            };
        });
    };
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
                    || (datakey == 'posts' && (!Array.isArray(formdata[datakey]) || formdata[datakey].some(a => !a.time)))
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

        /*Format payload */
        payload = {
            ...payload,
            start_date: Utils.formatDateTime(payload.daterange[0], 'YYYY-MM-DD'),
            end_date: Utils.formatDateTime(payload.daterange[1], 'YYYY-MM-DD'),

            days: String(payload.days.join(',')).trim(),
            tone: String(payload.tone.join(',')).trim(),
            media: String(payload.media.join(',')).trim(),
        }

        payload.posts = payload.posts?.map(post => {

            post._time = Utils.formatDateTime(post.time, 'HH:mm:SS')
            delete post.time

            return post
        })

        delete payload.daterange


        setIsLoading(true)

        let response = {
            success: false,
            message: 'Request failed, Please try again!'
        }

        if (type == 'create') response = await schedulesHandler.create(payload)
        else if (type == 'edit') response = await schedulesHandler.update({ id, ...payload })

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
    const handleAddPost = () => {

        let formData = { ...Form_Data }

        formData.posts.push({ id: formData.posts.length || 1, time: null, description: null })

        setForm_Data({ ...formData })
    }

    const handlePostInputChange = (idx, key, value) => {

        let formData = { ...Form_Data }

        formData.posts[idx][key] = value

        setForm_Data({ ...formData })
    }
    const handleDeletePost = (idx) => {

        let formData = { ...Form_Data }

        formData.posts.splice(idx, 1)

        setForm_Data({ ...formData })
    }

    const getSchedule = async (filters = {}) => {

        filters = {
            ...filters,
            columns: '*',
        }

        setIsLoading(true)
        let response = await schedulesHandler.get(filters)
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
            setwarningAlertMessage('Failed to get schedule, Please try to re-open!')
        }

        let schedule_data = response.data[0]

        setForm_Data({
            name: schedule_data.name,
            brand_id: schedule_data.brand_id,
            description: schedule_data.description,
            industry: schedule_data.industry,
            category: schedule_data.category,
            language: schedule_data.language,
            daterange: [dayjs(new Date(schedule_data.start_date)), dayjs(new Date(schedule_data.end_date))],
            days: String(schedule_data.days).split(','),
            keywords: schedule_data.keywords,
            media: String(schedule_data.media).split(','),
            posts: schedule_data.posts?.map(d => {
                d.time = dayjs(d._time, TIME_FORMAT)
                delete d._time
                return d
            }) || [{ id: 1, time: null, description: null }],
            tone: String(schedule_data.tone).split(','),
            call_to_action: schedule_data.call_to_action,
        })


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

        if (type != 'create' && !id) navigator(-1)
        if (type != 'create' && id) getSchedule({ id })
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
            {/* <PopupWrapper> */}
            <Modal
                title="Add new Campaign"
                open={true}
                onOk={handleSave}
                onCancel={handleClose}
                cancelText="Discard"
                centered={true}
                width="800px"
                okText="Save"
                bodyStyle={{ height: 500, overflowY: 'auto' }}
            >

                <InputWrapper>
                    <Inputs
                        id="add-campaign-name"
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
                        id="add-campaign-brand"
                        type="select"
                        width='lg'
                        input_props={{
                            readonly: ReadOnlyData.brand_id,
                            value: Form_Data.brand_id,
                            onChange: (val) => handleInputChange('brand_id', val),
                            required: RequiredData.brand_id,
                            options: BrandOptions,
                            has_option_icon: true,
                            placeholder: 'Select your brand',
                            label: "Brand",
                            invalid: InvalidData.brand_id,
                        }}
                    />
                    <Inputs
                        id="add-campaign-description"
                        type="textarea"
                        width='max'
                        input_props={{
                            type: "text",
                            readonly: ReadOnlyData.description,
                            value: Form_Data.description,
                            placeholder: 'Describe your campaign here...',
                            onChange: (val) => handleInputChange('description', val),
                            required: RequiredData.description,
                            label: "Description",
                            invalid: InvalidData.description,
                        }}
                    />
                </InputWrapper>

                <SectionHead
                    title={'Schedule details'}
                    info={'Schedule details'}
                />
                <InputWrapper>
                    <Inputs
                        id="add-campaign-industry"
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
                        id="add-campaign-category"
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

                    <Inputs
                        id="add-campaign-language"
                        type="select"
                        width='half'
                        input_props={{
                            readonly: ReadOnlyData.language,
                            value: Form_Data.language,
                            onChange: (val) => handleInputChange('language', val),
                            required: RequiredData.language,
                            options: getLanguages(),
                            placeholder: 'Select blog language',
                            label: "Language",
                            invalid: InvalidData.language,
                        }}
                    />
                    <Inputs
                        id="add-campaign-daterange"
                        type="daterange"
                        width='half'
                        input_props={{
                            readonly: ReadOnlyData.daterange,
                            value: Form_Data.daterange,
                            onChange: (val) => handleInputChange('daterange', val),
                            type: "text",
                            required: RequiredData.daterange,
                            placeholder: "YYYY-MM-DD",
                            label: "Duration",
                            invalid: InvalidData.daterange,
                        }}
                    />
                </InputWrapper>
                <SectionHead
                    title={'Posts details'}
                    info={'Create multiple post with timing/day'}
                    actions={type != 'view' ? [
                        {
                            id: 'add_new',
                            type: 'primary_outline',
                            width: 'auto',
                            label: 'Add Post',
                            icon: Icons.default.plus,
                            callback: handleAddPost
                        }
                    ] : []}
                />
                <InputWrapper>

                    {Form_Data.posts?.map((post, idx) => (
                        <div
                            key={`posts-item-${idx}`}
                            className="multiinput-wrapper-main"
                        >


                            <Inputs
                                id={`add-campaign-post-${idx}-sno`}
                                type="text"
                                width='xxs'
                                input_props={{
                                    type: "text",
                                    placeholder: '',
                                    readonly: true,
                                    value: idx + 1,
                                    label: "S:No",
                                }}
                            />
                            <Inputs
                                id={`add-campaign-post-${idx}-time`}
                                type="time"
                                width='xs'
                                input_props={{
                                    readonly: ReadOnlyData.posts,
                                    value: post.time,
                                    onChange: (val) => handlePostInputChange(idx, 'time', val),
                                    required: RequiredData.posts,
                                    placeholder: "HH:mm",
                                    label: "Time",
                                    invalid: InvalidData.posts,
                                }}
                            />
                            <Inputs
                                id={`add-campaign-post-${idx}-description`}
                                type="text"
                                width='sm'
                                input_props={{
                                    type: "text",
                                    placeholder: '(Optional)',
                                    readonly: ReadOnlyData.posts,
                                    value: post.description,
                                    onChange: (val) => handlePostInputChange(idx, 'description', val),
                                    label: "Description",
                                    invalid: InvalidData.posts,
                                }}
                            />
                            {(idx > 0 && !ReadOnlyData.posts) &&
                                <div className="icon-delete"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.delete }}
                                    onClick={() => handleDeletePost(idx)}
                                ></div>
                            }
                        </div>
                    ))}

                </InputWrapper>
                <InputWrapper>
                    <Inputs
                        id="add-campaign-keywords"
                        type="textarea"
                        width='half'
                        input_props={{
                            readonly: ReadOnlyData.keywords,
                            value: Form_Data.keywords,
                            placeholder: "Type kewords with ',' seperate",
                            onChange: (val) => handleInputChange('keywords', val),
                            required: RequiredData.keywords,
                            label: "Keywords",
                            info_tooltip: "Type with ',' seperated.",
                            invalid: InvalidData.keywords,
                        }}
                    />
                    <Inputs
                        id="add-campaign-days"
                        type="multiselect"
                        width='half'
                        input_props={{
                            readonly: ReadOnlyData.days,
                            value: Form_Data.days,
                            onChange: (val) => handleInputChange('days', val),
                            required: RequiredData.days,
                            placeholder: "Select days to be blogs posted",
                            label: "Days",
                            options: DurationDaysOptions,
                            invalid: InvalidData.days,
                        }}
                    />
                </InputWrapper>
                <InputWrapper>
                    <Inputs
                        id="add-campaign-tone"
                        type="multiselect"
                        width='half'
                        input_props={{
                            readonly: ReadOnlyData.tone,
                            value: Form_Data.tone,
                            onChange: (val) => handleInputChange('tone', val),
                            required: RequiredData.tone,
                            options: ToneOptions,
                            placeholder: "Select tones for blogs",
                            label: "Tone",
                            invalid: InvalidData.tone,
                        }}
                    />
                    <Inputs
                        id="add-campaign-media"
                        type="multiselect"
                        width='half'
                        input_props={{
                            readonly: ReadOnlyData.media,
                            value: Form_Data.media,
                            onChange: (val) => handleInputChange('media', val),
                            required: RequiredData.media,
                            options: MediaOptions,
                            placeholder: "Select which all medias to be posted",
                            label: "Media",
                            invalid: InvalidData.media,
                        }}
                    />
                    <Inputs
                        id="add-campaign-call_to_action"
                        type="text"
                        width='max'
                        input_props={{
                            readonly: ReadOnlyData.call_to_action,
                            value: Form_Data.call_to_action,
                            placeholder: 'Enter Contact URL or Phone number',
                            onChange: (val) => handleInputChange('call_to_action', val),
                            required: RequiredData.call_to_action,
                            label: "Call to action",
                            invalid: InvalidData.call_to_action,
                        }}
                    />
                </InputWrapper>


            </Modal>
            {/* </PopupWrapper> */}

        </>
    )
}

export default AddCampaign;