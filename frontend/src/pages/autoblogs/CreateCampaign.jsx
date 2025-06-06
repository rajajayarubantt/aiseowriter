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
import MoreOptionsBtn from '../../components/MoreOptionsBtn'
import Stepper from "../../components/Stepper";

/*Constant Data*/
import { LanguagesData } from '../../data/data'

/*handler*/
import CampaignsHandler from '../../handlers/campaigns/campaigns'
import BrandHandler from '../../handlers/brands/brands'
import Images from "../../assets/Images";


const CreateCampaign = ({ callback = () => { } }) => {

    const navigator = useNavigate()
    const campaignsHandler = new CampaignsHandler()
    const brandHandler = new BrandHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [BrandOptions, setBrandOptions] = useState([])
    const ToneOptions = [
        {
            value: 'Professional',
            label: 'Professional'
        },

        {
            value: 'Academic',
            label: 'Academic'
        },

        {
            value: 'Casual',
            label: 'Casual'
        },

        {
            value: 'Informative',
            label: 'Informative'
        },

        {
            value: 'Storytelling',
            label: 'Storytelling'
        },

        {
            value: 'Transactional',
            label: 'Transactional'
        },


    ]
    const ViewOptions = [
        {
            value: 'First person singular (I)',
            label: 'First person singular (I)'
        },
        {
            value: 'First person plural (we)',
            label: 'First person plural (we)'
        },
        {
            value: 'Second person',
            label: 'Second person'
        },
        {
            value: 'Third person',
            label: 'Third person'
        },

    ]
    const LengthOptions = [
        {
            value: '2000+',
            label: '2000+ words'
        },
        {
            value: '700+',
            label: '700+ words'
        },

    ]
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
    const PostCountOptions = [
        {
            value: '1',
            label: '1'
        },
        {
            value: '2',
            label: '2'
        },
        {
            value: '3',
            label: '3'
        },
        {
            value: '4',
            label: '4'
        },
        {
            value: '5',
            label: '5'
        },
        {
            value: '6',
            label: '6'
        },
        {
            value: '7',
            label: '7'
        },
        {
            value: '8',
            label: '8'
        },
        {
            value: '9',
            label: '9'
        },
        {
            value: '10',
            label: '10'
        },

    ]
    const ScheduleOptions = [
        {
            value: 'post_now',
            label: 'Post now'
        },
        {
            value: 'schedule',
            label: 'Schedule posts'
        },

    ]
    const ScheduleTimeOptions = [
        {
            label: 'Peek traffic 8 am (GMT)',
            value: 'peek'
        },
        {
            label: 'Moderate traffic 12 pm, 3 pm (GMT)',
            value: 'moderate'
        },
        {
            label: 'Normal traffic 6 pm, 8 pm (GMT)',
            value: 'normal'
        },

    ]
    const PlatformsOptions = [...Images.integrations]
    const [CustomTimeZone, setCustomTimeZone] = useState(false)
    const [ShowMoreOptions, setShowMoreOptions] = useState(false)
    const [DataValid, setDataValid] = useState(false)


    const [CurrentStep, setCurrentStep] = useState(0);
    const StepperItems = [
        { title: 'Add keywords', disable: false },
        { title: 'Schedule', disable: false }
    ]
    const onStepperChange = val => setCurrentStep(val)

    const [Form_Data, setForm_Data] = useState({
        name: '',
        cover_image: 'none',
        brand_id: null,
        description: null,
        language: "English (US)",
        keywords: [],
        tone: ToneOptions[0].value,
        view: ViewOptions[0].value,
        length: LengthOptions[0].value,
        schedule_type: ScheduleOptions[0].value,
        platforms: [...PlatformsOptions],
        post_count: 1,
        post_daily: false,
        time_zone: 'peek',
        post_custom_time_zones: [{ time: null, desc: '' }]
    })

    const RequiredData = {
        name: true,
        cover_image: true,
        brand_id: false,
        description: false,
        language: true,
        keywords: true,
        post_custom_time_zones: CustomTimeZone,
        platforms: CurrentStep == 1,
    }
    const [InvalidData, setInvalidData] = useState(Object.fromEntries(Object.keys(Form_Data).map(k => [k, false])))


    const getLanguages = () => {
        return LanguagesData.map((l, idx) => {
            return {
                value: l.label,
                label: l.label,
                icon: l.icon
            };
        });
    };

    const ValidateForm = (formdata, updateState = true) => {


        let invaliddata = {}

        for (const datakey in formdata) {

            const isInvalid = (key, value) => {
                if (!RequiredData[key]) return false
                if (value === '' || value === null) return true;
                if (key === 'keywords') return !Array.isArray(value) || value.length === 0;
                if (key === 'post_custom_time_zones') return Array.isArray(value) && value.some(d => !d?.time);
                if (key === 'platforms') return Array.isArray(value) && !value.some(d => d?.selected);
                return false;
            };

            invaliddata[datakey] = isInvalid(datakey, formdata?.[datakey])
        }

        if (updateState) setInvalidData({ ...InvalidData, ...invaliddata })

        return invaliddata

    }

    const handleClose = () => {
        if (callback) callback()
        return navigator(-1)
    }

    const handleSubmit = async () => {

        if (CurrentStep == 0) {
            setCurrentStep(1)
            return
        }

        let payload = { ...Form_Data }

        let invalidfields = ValidateForm(payload)

        if (Object.keys(invalidfields).some(d => invalidfields[d])) {
            setWarningAlert(true)
            setWarningAlertType('warning')
            setwarningAlertMessage('Please fill all fields!')

            return
        }

        payload.schedule_type = payload.schedule_type == 'schedule' ? '1' : '0'
        payload.platforms = payload.platforms.filter(p => p.selected).map(p => p.value)
        payload.post_custom_time_zones = payload.post_custom_time_zones.map(p => {
            return {
                time: Utils.formatDateTime(p.time, 'HH:mm:SS'),
                desc: p.desc
            }
        })


        console.log(payload, 'payload');

        setIsLoading(true)

        let response = await campaignsHandler.create(payload)

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        return handleClose()
    }

    const handleInputChange = (key, value, sub_idx, sub_key, sub_value) => {
        let formData = { ...Form_Data };

        if (key == 'post_count') {
            const targetCount = Math.max(0, Number(value));
            const post_custom_time_zones = [...formData.post_custom_time_zones];

            if (post_custom_time_zones.length < targetCount) {
                const toAdd = targetCount - post_custom_time_zones.length;
                post_custom_time_zones.push(
                    ...Array(toAdd).fill().map(() => ({ time: "", desc: "" }))
                );
            } else if (post_custom_time_zones.length > targetCount) {
                post_custom_time_zones.length = targetCount; // truncate
            }

            formData[key] = value
            formData['post_custom_time_zones'] = post_custom_time_zones
        }
        else if (key == 'post_custom_time_zones') {
            formData[key][sub_idx][sub_key] = sub_value
        }
        else formData[key] = value

        // Perform validation on the updated formData
        const invalidFields = ValidateForm(formData);
        const isValid = !Object.keys(invalidFields).some(d => invalidFields[d]);
        if (CurrentStep == 0) setDataValid(isValid);

        // Update the state
        setForm_Data(formData);
    };

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

    const renderKeyWorksSection = () => {
        return (
            <InputWrapper>
                <Inputs
                    id="add-campaign-name"
                    type="text"
                    width='max'
                    input_props={{
                        placeholder: 'Please Enter Campaign name',
                        value: Form_Data.name,
                        onChange: (val) => handleInputChange('name', val),
                        label: "Campaign Name",
                        invalid: InvalidData.name,
                    }}
                />
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

                <Inputs
                    id="add-campaign-length"
                    type="segment"
                    width='max'
                    input_props={{
                        value: Form_Data.length,
                        options: LengthOptions,
                        has_option_icon: true,
                        allowclear: false,
                        placeholder: 'Select article length',
                        label: "Article length",
                        invalid: InvalidData.length,
                        onChange: (val) => handleInputChange('length', val),
                    }}
                />

                {!ShowMoreOptions &&
                    <MoreOptionsBtn
                        callback={() => setShowMoreOptions(true)}
                    />
                }
                {ShowMoreOptions &&


                    <>
                        <Inputs
                            id="add-campaign-tone"
                            type="select"
                            width='max'
                            input_props={{
                                value: Form_Data.tone,
                                options: ToneOptions,
                                has_option_icon: true,
                                allowclear: false,
                                placeholder: 'Select article tone',
                                label: "Voice of tone",
                                invalid: InvalidData.tone,
                                onChange: (val) => handleInputChange('tone', val),
                            }}

                        />
                        <Inputs
                            id="add-campaign-view"
                            type="select"
                            width='max'
                            input_props={{
                                value: Form_Data.view,
                                options: ViewOptions,
                                has_option_icon: true,
                                allowclear: false,
                                placeholder: 'Select article view',
                                label: "Point of view",
                                invalid: InvalidData.view,
                                onChange: (val) => handleInputChange('view', val),
                            }}
                        />
                        <Inputs
                            id="add-campaign-inter_links"
                            type="switch"
                            width='max'
                            input_props={{
                                value: Form_Data.inter_links,
                                options: ToneOptions,
                                has_option_icon: true,
                                label: "Auto-build internal links",
                                label_desc: "Import sitemap for smart internal linking strategies.",
                                invalid: InvalidData.inter_links,
                                onChange: (val) => handleInputChange('inter_links', val),
                            }}
                        />
                    </>
                }

            </InputWrapper>
        )
    }
    const renderScheduleSection = () => {
        return (
            <InputWrapper>
                <Inputs
                    id="add-campaign-length"
                    type="segment"
                    width='max'
                    input_props={{
                        value: Form_Data.schedule_type,
                        options: ScheduleOptions,
                        has_option_icon: true,
                        allowclear: false,
                        placeholder: 'Select article length',
                        onChange: (val) => handleInputChange('schedule_type', val),
                    }}
                />
                {Form_Data.schedule_type == 'schedule' &&
                    <Inputs
                        id="add-campaign-post_daily"
                        type="switch"
                        width='max'
                        input_props={{
                            value: Form_Data.post_daily,
                            onChange: (val) => handleInputChange('post_daily', val),
                            has_option_icon: true,
                            placeholder: 'Select your brand',
                            label: "Post daily",
                            invalid: InvalidData.post_daily,
                        }}
                    />
                }
                <Inputs
                    id="add-campaign-post_count"
                    type="select"
                    width='max'
                    input_props={{
                        value: Form_Data.post_count,
                        onChange: (val) => handleInputChange('post_count', val),
                        options: PostCountOptions,
                        has_option_icon: true,
                        placeholder: 'Select your brand',
                        label: `Number of articles to generate ${Form_Data.post_daily ? '/day' : ''}`,
                        invalid: InvalidData.post_count,
                    }}
                />
                {Form_Data.schedule_type == 'schedule' &&
                    <>
                        {!CustomTimeZone &&
                            <Inputs
                                id="add-campaign-time_zone"
                                type="segment"
                                width='max'
                                input_props={{
                                    value: Form_Data.time_zone,
                                    options: ScheduleTimeOptions,
                                    vertical: true,
                                    has_option_icon: true,
                                    allowclear: false,
                                    placeholder: 'Select article length',
                                    invalid: InvalidData.time_zone,
                                    onChange: (val) => handleInputChange('time_zone', val),
                                }}
                            />
                        }

                        <Inputs
                            id="add-campaign-time_zone_custom"
                            type="switch"
                            width='max'
                            input_props={{
                                value: CustomTimeZone,
                                has_option_icon: true,
                                label: "Post in Custom time zones",
                                onChange: (val) => setCustomTimeZone(val),
                            }}
                        />
                        {CustomTimeZone &&
                            <div className="multiinput-wrapper-container">
                                {Form_Data.post_custom_time_zones?.map((post, idx) => (
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
                                                value: `${idx + 1}`,
                                                label: idx > 0 ? '' : "S:No",
                                            }}
                                        />
                                        <Inputs
                                            id={`add-campaign-post-${idx}-time`}
                                            type="time"
                                            width='xs'
                                            input_props={{
                                                value: post.time,
                                                onChange: (val) => handleInputChange('post_custom_time_zones', null, idx, 'time', val),
                                                placeholder: "HH:mm",
                                                invalid: InvalidData.post_custom_time_zones,
                                                label: idx > 0 ? '' : "Time",
                                            }}
                                        />
                                        <Inputs
                                            id={`add-campaign-post-${idx}-desc`}
                                            type="text"
                                            width='sm'
                                            input_props={{
                                                type: "text",
                                                placeholder: '(Optional)',
                                                value: post.desc,
                                                onChange: (val) => handleInputChange('post_custom_time_zones', null, idx, 'desc', val),
                                                label: idx > 0 ? '' : "Description",
                                            }}
                                        />

                                    </div>
                                ))}
                            </div>
                        }
                    </>
                }
                <Inputs
                    id="add-campaign-length"
                    type="checkboxs"
                    width='max'
                    input_props={{
                        value: Form_Data.platforms,
                        options: PlatformsOptions,
                        has_option_icon: true,
                        allowclear: false,
                        label: 'Publish to your site',
                        checkbox_width: 'half',
                        info_tooltip: 'Automatically push your articles to your designated website.',
                        placeholder: 'Select article length',
                        invalid: InvalidData.platforms,
                        onChange: (val) => handleInputChange('platforms', val),
                    }}
                />

            </InputWrapper>
        )
    }

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
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div className="custom-modal-header">
                            <div className="modal-header-title" >
                                Auto Blogging Campaign</div>
                            <div className="modal-header-desc">
                                Add keyword(s) and provide a brief topic idea for AI to begin with.
                            </div>
                        </div>
                        <Stepper
                            active={CurrentStep}
                            steps={StepperItems}
                            callback={onStepperChange}
                        />
                    </div>
                }
                className="custom-modal"
                open={true}
                width={'400px'}
                onCancel={handleClose}
                cancelText="Discard"
                centered={true}
                maskClosable={false}
                footer={[
                    CurrentStep == 1 &&
                    <Buttons
                        type={"outline"}
                        width={'half'}
                        label={`Back`}
                        callback={() => onStepperChange(0)}
                        _style={{
                            height: '42px'
                        }}
                    />,
                    <Buttons
                        button_type={"submit"}
                        type={"primary"}
                        width={`${CurrentStep == 1 ? 'half' : 'max'}`}
                        label={`${CurrentStep == 1 ? 'Submit' : 'Next'}`}
                        callback={handleSubmit}
                        disable={!DataValid}
                        _style={{
                            height: '42px'
                        }}
                    />
                ]}
                styles={{
                    overflowY: 'auto',
                    paddingTop: '16px',
                    paddingRight: '8px',
                }}
            >


                {CurrentStep == 1 ?
                    renderScheduleSection()
                    : renderKeyWorksSection()
                }

            </Modal>

        </>
    )
}

export default CreateCampaign;