import React, { useEffect, useState } from "react";
import { Steps, Radio } from 'antd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux'
/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Buttons from '../../components/Buttons'
import NoCreditPopupBtn from '../../components/NoCreditPopupBtn'

/*Constant Data*/
import { LanguagesData } from '../../data/data'

/*handler*/
import ArticlesHandler from '../../handlers/articles/articles'

const TitleEditSection = ({ data, callback = () => { } }) => {

    const articlesHandler = new ArticlesHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const store = useSelector(state => state)

    const [Language, setLanguage] = useState(LanguagesData[0])
    const [TitleOptions, setTitleOptions] = useState([])
    const [initialOutlineItems, setinitialOutlineItems] = useState([])

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
            label: 'Medium (2000+ words)'
        },
        {
            value: '700+',
            label: 'Short (700+ words)'
        },

    ]

    const [isFreePlan, setIsFreePlan] = useState(false)

    const [Form_Data, setForm_Data] = useState({
        title: TitleOptions[0],
        title_options: TitleOptions,
        outlines: [...initialOutlineItems],
        tone: ToneOptions[0].value,
        view: ViewOptions[0].value,
        length: LengthOptions[0].value,
        inter_links: false,
    })

    const handleInputChange = (key, value) => {

        setForm_Data({ ...Form_Data, [key]: value })
    }

    const onOutlineItemDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const reordered = Array.from(Form_Data.outlines);
        const [moved] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, moved);

        handleInputChange('outlines', reordered);
    };

    const handleGenerate = () => {

        let payload = {
            id: data.id,
            description: data.description,
            keywords: data.keywords,
            language: data.language,
            brand_name: data.brand_name,
            ...Form_Data
        }


        return callback(payload)

    }

    const setArticle = (data) => {
        if (!data) return
        if (data.language) {
            let language = LanguagesData.find(l => l.label == data.language) || LanguagesData[0]
            setLanguage(language)
        }

        if (data.title_options) setTitleOptions(data.title_options)
        if (data.outlines) setinitialOutlineItems(data.outlines)

        setForm_Data(prev => {
            const updated = { ...prev };
            if (data.title) updated['title'] = data.title
            if (data.outlines) updated['outlines'] = data.outlines

            if (data.tone) updated['tone'] = data.title
            if (data.view) updated['view'] = data.title
            if (data._length) updated['length'] = data._length

            return updated;
        });

    }


    const reGenerate = async (key) => {


        return
        let payload = {
            id: data.id,
            brand_id: data.brand_id,
            brand_name: data.brand_name,
            description: data.description,
            language: data.language,
            keywords: data.keywords,
        }


        setIsLoading(true)

        let response = {
            success: false
        }

        if (key == 'title') response = await articlesHandler.regenerate_title(payload)
        else if (key == 'outline') response = await articlesHandler.regenerate_outlines(payload)

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        const { title_options, outlines } = response.data

        if (key == 'title') {
            setTitleOptions(title_options)
            setForm_Data({ ...Form_Data, 'title': title_options[0] })
        }
        else if (key == 'outline') {
            setForm_Data({ ...Form_Data, 'outlines': outlines })
        }
    }

    const [ActiveEditTitleIdx, setActiveEditTitleIdx] = useState(null)
    const [ActiveEditTitleValue, setActiveEditTitleValue] = useState('')

    const [ActiveEditOutlineIdx, setActiveEditOutlineIdx] = useState(null)
    const [ActiveEditOutlineValue, setActiveEditOutlineValue] = useState('')

    const setEditTitle = async (idx, value) => {
        setActiveEditTitleIdx(idx)
        setActiveEditTitleValue(value)
    }
    const handleEditTitle = async (idx, value) => {

        if (TitleOptions.length > idx) {
            let titleOptions = [...TitleOptions]

            if (Form_Data.title == titleOptions[idx]) setForm_Data({ ...Form_Data, 'title': value })

            titleOptions[idx] = value
            setTitleOptions(titleOptions)
        }

        setActiveEditTitleIdx(null)
        setActiveEditTitleValue('')
    }
    const handleEditCancelTitle = async () => {

        setActiveEditTitleIdx(null)
        setActiveEditTitleValue('')
    }

    const setEditOutline = async (idx, value) => {
        setActiveEditOutlineIdx(idx)
        setActiveEditOutlineValue(value)
    }
    const handleEditOutline = async (idx, value) => {

        if (Form_Data.outlines.length > idx) {
            let outlines = [...Form_Data.outlines]
            outlines[idx] = value

            setForm_Data({ ...Form_Data, 'outlines': outlines })
        }

        setActiveEditOutlineIdx(null)
        setActiveEditOutlineValue('')
    }
    const handleEditCancelOutline = async () => {
        setActiveEditOutlineIdx(null)
        setActiveEditOutlineValue('')
    }

    const handleDeleteOutline = (idx) => {
        const outlines = Form_Data.outlines.filter((_, index) => index !== idx)
        setForm_Data({ ...Form_Data, 'outlines': outlines })
    }

    const handleAddOutline = () => {
        const _outlines = [...Form_Data.outlines]
        _outlines.push('')
        setForm_Data({ ...Form_Data, 'outlines': _outlines })

        setTimeout(() => {
            setActiveEditOutlineIdx(_outlines.length - 1)
            setActiveEditOutlineValue('')

            const outlineContainer = document.querySelector('#outline-items-section')
            if (outlineContainer) {

                outlineContainer.scrollTo({
                    top: outlineContainer.scrollHeight + 1000,
                    behavior: 'smooth'
                })
            }
        }, 100)
    }

    useEffect(() => {

        if (store.user.subscription) setIsFreePlan(store.user.subscription.is_freeplan)

    }, [store.user.subscription])

    useEffect(() => {
        setArticle(data)
    }, [data])

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
            <div className="article-page-content">

                <div className="article-content-settings">
                    <InputWrapper>
                        <div className="settings-item">
                            <div className="label">Article language</div>
                            <div className="value-main">
                                <div className="icon"
                                    dangerouslySetInnerHTML={{ __html: Language.icon }}
                                ></div>
                                <div className="value-label">{Language.label}</div>

                            </div>
                        </div>
                        <Inputs
                            id="article-settings-tone"
                            type="select"
                            width='max'
                            input_props={{
                                value: Form_Data.tone,
                                options: ToneOptions,
                                has_option_icon: true,
                                allowclear: false,
                                placeholder: 'Select article tone',
                                label: "Voice of tone",
                                onChange: (val) => handleInputChange('tone', val),
                            }}

                        />
                        <Inputs
                            id="article-settings-view"
                            type="select"
                            width='max'
                            input_props={{
                                value: Form_Data.view,
                                options: ViewOptions,
                                has_option_icon: true,
                                allowclear: false,
                                placeholder: 'Select article view',
                                label: "Point of view",
                                onChange: (val) => handleInputChange('view', val),
                            }}
                        />

                        <Inputs
                            id="article-settings-length"
                            type="segment"
                            width='max'
                            input_props={{
                                value: Form_Data.length,
                                options: LengthOptions,
                                has_option_icon: true,
                                allowclear: false,
                                placeholder: 'Select article length',
                                label: "Article length",
                                onChange: (val) => handleInputChange('length', val),
                            }}
                        />
                        <Inputs
                            id="article-settings-inter_links"
                            type="switch"
                            width='max'
                            input_props={{
                                value: Form_Data.inter_links,
                                options: ToneOptions,
                                has_option_icon: true,
                                label: "Auto-build internal links",
                                label_desc: "Import sitemap for smart internal linking strategies.",
                                onChange: (val) => handleInputChange('inter_links', val),
                            }}
                        />
                    </InputWrapper>
                    <Buttons
                        type={'primary'}
                        icon={Icons.default.glow}
                        width={'max'}
                        label={'Generate Article'}
                        _style={{
                            height: '46px'
                        }}
                        callback={handleGenerate}
                    />
                </div>
                <div className="article-content-sections">
                    <div className="article-content-section">
                        <div className="section-header">
                            <div className="section-header-title">Title</div>
                            <div className="section-header-actions">

                                {isFreePlan ?
                                    <NoCreditPopupBtn
                                        title="Unlock this feature"
                                        description="Upgrade Plan to unlock this feature."
                                        type="outline"
                                        icon={Icons.default.refresh}
                                        width="auto"
                                        label="Regenerate"
                                    />
                                    :

                                    <Buttons
                                        type="outline"
                                        icon={Icons.default.refresh}
                                        width="auto"
                                        label="Regenerate"
                                        _style={{
                                            minHeight: '1.8rem'
                                        }}
                                        callback={() => reGenerate('title')}
                                    />}
                            </div>
                        </div>
                        <div className="section-items">
                            {TitleOptions?.map((item, idx) => (
                                <div
                                    key={`article-title-section-${idx}`}
                                    className={`section-item ${Form_Data.title == item && 'section-item-active'}`}
                                >
                                    {ActiveEditTitleIdx == idx ?
                                        <div className="section-item-input-main">
                                            <input
                                                type="text"
                                                className="section-item-input"
                                                value={ActiveEditTitleValue}
                                                onChange={(e) => setActiveEditTitleValue(e.target.value)}
                                                placeholder="Enter the modified title here"
                                            />
                                            <div className="section-item-input-actions">
                                                <div className="action-item"
                                                    onClick={() => handleEditCancelTitle()}
                                                >Cancel</div>
                                                <div
                                                    className="action-item action-primary"

                                                    onClick={() => handleEditTitle(idx, ActiveEditTitleValue)}
                                                >Save</div>
                                            </div>

                                        </div>
                                        :
                                        <>
                                            <div className="section-item-actions">
                                                <div className="section-item-action"
                                                    dangerouslySetInnerHTML={{ __html: Icons.default.edit }}
                                                    onClick={() => setEditTitle(idx, item)}
                                                ></div>
                                            </div>



                                            <Radio
                                                checked={Form_Data.title == item}
                                                onChange={() => handleInputChange('title', item)}
                                            >{item}</Radio>
                                        </>
                                    }
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="article-content-section">
                        <div className="section-header">
                            <div className="section-header-title">Article Outline</div>
                            <div className="section-header-actions">
                                {/* <Inputs
                                    id="article-outline-sections"
                                    type="number"
                                    width='xs'
                                    input_props={{
                                        placeholder: 'Sections',
                                        style: {
                                            height: '1.8rem'
                                        },
                                        max: 10,
                                        value: Form_Data.outlines.length,
                                    }}
                                /> */}

                                {isFreePlan ?
                                    <NoCreditPopupBtn
                                        title="Unlock this feature"
                                        description="Upgrade Plan to unlock this feature."
                                        type="outline"
                                        icon={Icons.default.refresh}
                                        width="auto"
                                        label="Regenerate"
                                    />
                                    :

                                    <Buttons
                                        type="outline"
                                        icon={Icons.default.refresh}
                                        width="auto"
                                        label=""
                                        _style={{
                                            minHeight: '1.8rem'
                                        }}
                                        callback={() => reGenerate('outline')}
                                    />}

                                <Buttons
                                    type="outline"
                                    icon={Icons.default.plus}
                                    width="auto"
                                    label="Add"
                                    _style={{
                                        minHeight: '1.8rem'
                                    }}
                                    callback={() => handleAddOutline()}
                                />
                            </div>
                        </div>
                        <DragDropContext onDragEnd={onOutlineItemDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="section-items"
                                        id="outline-items-section"
                                    >
                                        {Form_Data.outlines.map((item, index) => (
                                            <Draggable
                                                key={`outline_${index}`}
                                                draggableId={`outline_${index}`}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`section-item ${snapshot.isDragging ? "section-item-dragging" : ""}`}
                                                    >
                                                        {ActiveEditOutlineIdx == index ?
                                                            <div className="section-item-input-main">
                                                                <input
                                                                    type="text"
                                                                    className="section-item-input"
                                                                    value={ActiveEditOutlineValue}
                                                                    onChange={(e) => setActiveEditOutlineValue(e.target.value)}
                                                                    placeholder="Enter the modified outline here"
                                                                />
                                                                <div className="section-item-input-actions">
                                                                    <div className="action-item"
                                                                        onClick={() => handleEditCancelOutline()}
                                                                    >Cancel</div>
                                                                    <div
                                                                        className="action-item action-primary"
                                                                        onClick={() => handleEditOutline(index, ActiveEditOutlineValue)}
                                                                    >Save</div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <>
                                                                <div
                                                                    className="section-item-actions">
                                                                    <div
                                                                        className="section-item-action"
                                                                        dangerouslySetInnerHTML={{ __html: Icons.default.edit }}
                                                                        onClick={() => setEditOutline(index, item)}
                                                                    ></div>
                                                                    <div
                                                                        className="section-item-action"
                                                                        dangerouslySetInnerHTML={{ __html: Icons.default.delete }}
                                                                        onClick={() => handleDeleteOutline(index)}
                                                                    ></div>
                                                                </div>
                                                                <div
                                                                    className="section-item-icon"
                                                                    dangerouslySetInnerHTML={{ __html: Icons.default.draggable }}
                                                                ></div>
                                                                <div className="section-item-label">{item}</div>
                                                            </>
                                                        }
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>
        </>
    )
}


export default TitleEditSection