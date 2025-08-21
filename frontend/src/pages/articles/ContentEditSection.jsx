import React, { useEffect, useState, useRef, useMemo } from "react";
import { marked } from 'marked';
import TurndownService from 'turndown';

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Dropcursor from '@tiptap/extension-dropcursor'
import Document from '@tiptap/extension-document'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Youtube from '@tiptap/extension-youtube'
import Blockquote from '@tiptap/extension-blockquote'
import Link from '@tiptap/extension-link'


import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Buttons from '../../components/Buttons'



/*handler*/
import ArticlesHandler from '../../handlers/articles/articles'

const ContentEditSection = ({ data, saveChanges, discardChanges, set_hasChanges = () => { } }) => {

    const articlesHandler = new ArticlesHandler()
    const turndownService = new TurndownService();


    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const extensions = [
        Document, Paragraph, Text, Image, Dropcursor, Youtube, Blockquote,
        Link.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
            protocols: ['http', 'https'],
            isAllowedUri: (url, ctx) => true
        }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
        }),
    ]

    const [ArticleTile, setArticleTile] = useState('')
    const [ArticleCoverImage, setArticleCoverImage] = useState({})
    const [ArticleCoverImageAlt, setArticleCoverImageAlt] = useState('')
    const [ArticleContent, setArticleContent] = useState('')
    const [ArticleMetaDescription, setArticleMetaDescription] = useState('')
    const [ArticleSchema, setArticleSchema] = useState('')
    const [ArticleFAQSchema, setArticleFAQSchema] = useState('')

    const [Had_Changes, setHad_Changes] = useState(false)

    const setArticle = (data) => {


        if (!data) return


        const { title, content, cover_image, meta_description, article_schema, faq_schema } = data

        const html_content = marked(content);

        setArticleTile(title)
        setArticleCoverImage(cover_image)
        setArticleCoverImageAlt(cover_image?.description || "")
        setArticleContent(html_content)
        setArticleMetaDescription(meta_description || "")

        setArticleSchema(article_schema ? `<script type="application/ld+json">${JSON.stringify(article_schema)}</script>` : 'No Article Schema Found!')
        setArticleFAQSchema(faq_schema ? JSON.stringify(faq_schema) : 'No FAQ Schema Found!')
    }

    useEffect(() => {
        setArticle(data)
    }, [data])



    const EditorToolsPopup = () => {

        const { editor } = useCurrentEditor()

        if (!editor) {
            return null
        }


        const EditorTools = {
            left: [
                [
                    {
                        id: 'h2',
                        icon: Icons.default.h2,
                        callback: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                        active: () => editor.isActive('heading', { level: 2 })
                    },
                    {
                        id: 'h3',
                        icon: Icons.default.h3,
                        callback: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                        active: () => editor.isActive('heading', { level: 3 })
                    },
                ],

                [
                    {
                        id: 'bold',
                        icon: Icons.default.bold,
                        callback: () => editor.chain().focus().toggleBold().run(),
                        active: () => editor.isActive('bold')
                    },
                    {
                        id: 'italic',
                        icon: Icons.default.italic,
                        callback: () => editor.chain().focus().toggleItalic().run(),
                        active: () => editor.isActive('italic')
                    },
                ],
                [
                    {
                        id: 'orderedList',
                        icon: Icons.default.number_list,
                        callback: () => editor.chain().focus().toggleOrderedList().run(),
                        active: () => editor.isActive('orderedList')
                    },
                    {
                        id: 'bulletList',
                        icon: Icons.default.order_list,
                        callback: () => editor.chain().focus().toggleBulletList().run(),
                        active: () => editor.isActive('bulletList')
                    },
                ],
                [
                    {
                        id: 'link',
                        icon: Icons.default.set_link,
                        callback: () => {
                            const url = window.prompt('Enter URL:');
                            if (url) {
                                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                            }
                        },
                        disable: editor.isActive('link'),
                        active: () => false
                    },
                    {
                        id: 'deset_link',
                        icon: Icons.default.deset_link,
                        callback: () => editor.chain().focus().unsetLink().run(),
                        disable: !editor.isActive('link'),
                        active: () => false
                    },
                    {
                        id: 'image',
                        icon: Icons.default.img,
                        callback: () => {
                            const url = window.prompt('Enter URL:');
                            if (url) {
                                editor.chain().focus().setImage({ src: url }).run();
                            }
                        },
                        active: () => editor.isActive('image')
                    },
                    {
                        id: 'youtube',
                        icon: Icons.default.youtube,
                        callback: () => {
                            const url = window.prompt('Enter URL:');
                            if (url) {
                                editor.commands.setYoutubeVideo({
                                    src: url,
                                    width: 640,
                                    height: 480,
                                })
                            }
                        },
                        active: () => editor.isActive('youtube')
                    },
                    {
                        id: 'blockquote',
                        icon: Icons.default.quotted,
                        callback: () => editor.chain().focus().toggleBlockquote().run(),
                        active: () => editor.isActive('blockquote')
                    },
                ]
            ],
            right: [
                [
                    {
                        id: 'undo',
                        icon: Icons.default.undo,
                        callback: () => editor.commands.undo(),
                        active: () => false
                    },
                    {
                        id: 'redo',
                        icon: Icons.default.redo,
                        callback: () => editor.commands.redo(),
                        active: () => false
                    },
                ]
            ]
        }

        return (

            <div className="article-content-tools">
                <div className="tools-items-left">


                    {EditorTools.left?.map((section, s_i) => (
                        <div
                            key={`article-content-tools-section-${s_i}`}
                            className="tools-items"
                        >
                            {section?.map((item, idx) => (
                                <div
                                    key={`article-content-tools-section-${idx}`}
                                    className={`tools-item ${item.disable && 'tools-item-disable'} ${(item.active && item.active()) && 'tools-item-active'}`}
                                    dangerouslySetInnerHTML={{ __html: item.icon }}
                                    onClick={() => item.callback(item.id)}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="tools-items-right">
                    {EditorTools.right?.map((section, s_i) => (
                        <div
                            key={`article-content-tools-section-${s_i}`}
                            className="tools-items"
                        >
                            {section?.map((item, idx) => (
                                <div
                                    key={`article-content-tools-section-${idx}`}
                                    className={`tools-item ${item.disable && 'tools-item-disable'} ${(item.active && item.active()) && 'tools-item-active'}`}
                                    dangerouslySetInnerHTML={{ __html: item.icon }}
                                    onClick={() => item.callback(item.id)}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>


        )
    }

    const handleInputChange = (key, value) => {

        set_hasChanges(true)
        setHad_Changes(true)

        if (key == 'title') setArticleTile(value)
        if (key == 'content') {
            let html_content = value.editor.getHTML();

            setArticleContent(html_content)
        }
        if (key == "image_alt") setArticleCoverImageAlt(value)
    }

    const handleSaveChanges = async () => {

        const payload = {
            id: data.id,
            title: ArticleTile,
            content: ArticleContent,
            cover_image: {
                ...ArticleCoverImage,
                description: ArticleCoverImageAlt
            }
        }

        setIsLoading(true)
        const response = await articlesHandler.update_article(payload)
        setIsLoading(false)


        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage(response.message)
    }

    const copyMetadescription = (description) => {
        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage('Meta description copied')
        navigator.clipboard.writeText(description)
    }
    const copyArticleSchema = (description) => {
        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage('Article schema copied')
        navigator.clipboard.writeText(description)
    }
    const copyFAQSchema = (description) => {
        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage('FAQ schema copied')
        navigator.clipboard.writeText(description)
    }


    useEffect(() => {
        if (discardChanges) setArticle(data)
        if (saveChanges && Had_Changes) handleSaveChanges()

    }, [saveChanges, discardChanges, Had_Changes])

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

                <div className="article-content-content hide-scrollbar"
                >
                    <div className="content-title">
                        <input
                            type="text"
                            placeholder="Write a title"
                            value={ArticleTile}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                    </div>
                    {ArticleContent &&
                        <EditorProvider
                            slotBefore={<EditorToolsPopup />}
                            extensions={extensions} content={ArticleContent}
                            onUpdate={(e) => handleInputChange('content', e)}
                        >
                        </EditorProvider>
                    }

                </div>
                <div className="article-content-details">
                    <div className="details-item">
                        <div className="item-head">
                            <div className="head-title">Cover Image</div>
                        </div>
                        <div className="item-image">
                            <div className="image-actions">
                                <div className="image-action-item">
                                    <div className="action-item-icon"
                                        dangerouslySetInnerHTML={{ __html: Icons.default.edit }}
                                    ></div>
                                    <div className="action-item-label">Edit</div>
                                </div>
                                <div className="image-action-item">
                                    <div className="action-item-icon" d
                                        dangerouslySetInnerHTML={{ __html: Icons.default.delete }}
                                    ></div>
                                    <div className="action-item-label">Delete</div>
                                </div>
                            </div>
                            <img src={ArticleCoverImage?.regular || Images.Default} alt="" />
                        </div>
                        <div className="item-input">
                            <label htmlFor="image_alt">Alt</label>
                            <input
                                id="image_alt"
                                type="text"
                                placeholder="Write a brief description of this image"
                                value={ArticleCoverImageAlt}
                                onChange={(e) => handleInputChange('image_alt', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="details-item">
                        <div className="item-head">
                            <div className="head-title">Meta Description</div>
                            <div className="head-actions">
                                {/* <div className="head-actions-item"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.refresh }}
                                ></div> */}
                                <div className="head-actions-item"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.copy }}
                                    onClick={() => copyMetadescription(ArticleMetaDescription)}
                                ></div>
                            </div>
                        </div>
                        <div className="item-textarea">
                            <textarea name="" id=""
                                value={ArticleMetaDescription || ""}
                            ></textarea>
                        </div>
                    </div>
                    <div className="details-item">
                        <div className="item-head">
                            <div className="head-title">Article Schema
                                <a className="info-icon"
                                    href="https://developers.google.com/search/docs/appearance/structured-data/article"
                                    target="_blank"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.info }}
                                ></a>
                            </div>
                            <div className="head-actions">
                                <div className="head-actions-item"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.copy }}
                                    onClick={() => copyArticleSchema(ArticleSchema)}
                                ></div>
                            </div>
                        </div>
                        <div className="item-head" style={{ marginTop: '1rem' }}>
                            <div className="head-title">FAQ Schema
                                <a className="info-icon"
                                    href="https://developers.google.com/search/docs/appearance/structured-data/faqpage"
                                    target="_blank"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.info }}
                                ></a>
                            </div>
                            <div className="head-actions">
                                <div className="head-actions-item"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.copy }}
                                    onClick={() => copyFAQSchema(ArticleFAQSchema)}
                                ></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}


export default ContentEditSection