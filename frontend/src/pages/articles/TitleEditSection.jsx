import React, { useEffect, useState } from "react";
import { Steps, Radio } from 'antd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

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

const TitleEditSection = ({ data, callback = () => { } }) => {

    const articlesHandler = new ArticlesHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")


    const [Language, setLanguage] = useState(LanguagesData[0])
    const [TitleOptions, setTitleOptions] = useState([
        "How an AI Writer Boosts BlogSEO for Autoblogging Success",
        "Automated AI Writing: The Future of BlogSEO and Web Traffic",
        "Dominating BlogSEO with an AI-Powered Autoblogging Tool",
        "Revolutionize Autoblogging: AI Writing for Maximum Web Traffic",
        "AI Writer Secrets to Skyrocket Your BlogSEO and Autoblogging",
    ])

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
    const initialOutlineItems = [
        {
            id: '1',
            label: "Understanding the Role of AI Writers in Modern Blogging"
        },
        {
            id: '2',
            label: "What is Autoblogging and Why It Matters for Content Creators"
        },
        {
            id: '3',
            label: "The Intersection of AI Writers and SEO: A Powerful Combination"
        },
        {
            id: '4',
            label: "How AI Enhances Keyword Research for High-Ranking Content"
        },
        {
            id: '5',
            label: "Optimizing Post Structure and Readability with AI Automation"
        },
        {
            id: '6',
            label: "Effortless Content Generation: Saving Time and Boosting Productivity"
        },
        {
            id: '7',
            label: "Utilizing AI to Stay Ahead of Algorithm Updates and Trends"
        },
        {
            id: '8',
            label: "Ensuring Authenticity and Originality in AI-Generated Content"
        },
        {
            id: '9',
            label: "AI-Powered Tools for Monitoring Performance and Analytics"
        },
        {
            id: '10',
            label: "Scaling Your Blog with AI-Driven Content Strategies"
        },
        {
            id: '11',
            label: "Balancing Automation and Human Touch for Sustained Success"
        },
        {
            id: '12',
            label: "Future Trends: AI's Continuing Influence on Blogging and SEO"
        },
    ]

    const [Form_Data, setForm_Data] = useState({
        title: TitleOptions[0],
        outline_items: [...initialOutlineItems],
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

        const reordered = Array.from(Form_Data.outline_items);
        const [moved] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, moved);

        handleInputChange('outline_items', reordered);
    };

    const handleGenerate = () => {

        let payload = {
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
        if (data.title) handleInputChange('title', data.title)
        if (data.tone) handleInputChange('tone', data.title)
        if (data.view) handleInputChange('view', data.title)
        if (data._length) handleInputChange('length', data._length)

    }

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
                                <Buttons
                                    type="outline"
                                    icon={Icons.default.refresh}
                                    width="auto"
                                    label="Regenerate"
                                    _style={{
                                        minHeight: '1.8rem'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="section-items">
                            {TitleOptions?.map((item, idx) => (
                                <div
                                    key={`article-title-section-${idx}`}
                                    className={`section-item ${Form_Data.title == item && 'section-item-active'}`}
                                >
                                    <div className="section-item-action"
                                        dangerouslySetInnerHTML={{ __html: Icons.default.edit }}
                                    ></div>
                                    <Radio
                                        checked={Form_Data.title == item}
                                        onChange={() => handleInputChange('title', item)}
                                    >{item}</Radio>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="article-content-section">
                        <div className="section-header">
                            <div className="section-header-title">Article Outline</div>
                            <div className="section-header-actions">
                                <Inputs
                                    id="article-outline-sections"
                                    type="number"
                                    width='xs'
                                    input_props={{
                                        placeholder: 'Sections',
                                        style: {
                                            height: '1.8rem'
                                        },
                                        value: 20,
                                    }}
                                />
                                <Buttons
                                    type="outline"
                                    icon={Icons.default.refresh}
                                    width="auto"
                                    label=""
                                    _style={{
                                        minHeight: '1.8rem'
                                    }}
                                />
                                <Buttons
                                    type="outline"
                                    icon={Icons.default.plus}
                                    width="auto"
                                    label="Add heading"
                                    _style={{
                                        minHeight: '1.8rem'
                                    }}
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
                                    >
                                        {Form_Data.outline_items.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`section-item ${snapshot.isDragging ? "section-item-dragging" : ""}`}
                                                    >
                                                        <div
                                                            className="section-item-action"
                                                            dangerouslySetInnerHTML={{ __html: Icons.default.delete }}
                                                        ></div>
                                                        <div
                                                            className="section-item-icon"
                                                            dangerouslySetInnerHTML={{ __html: Icons.default.draggable }}
                                                        ></div>
                                                        <div className="section-item-label">
                                                            {item.label}
                                                        </div>
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