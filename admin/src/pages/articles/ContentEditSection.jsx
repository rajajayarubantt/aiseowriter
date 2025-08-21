import React, { useEffect, useState, useRef, useMemo } from "react";

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

/*Constant Data*/
import { LanguagesData } from '../../data/data'

/*handler*/
import ArticlesHandler from '../../handlers/articles/articles'

const ContentEditSection = ({ data, callback = () => { } }) => {

    const articlesHandler = new ArticlesHandler()

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

    const content = `
        Hiii
    `

    const setArticle = (data) => {
        if (!data) return

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
                            value={'How an AI Writer Boosts BlogSEO for Autoblogging Success'}
                        />
                    </div>
                    <EditorProvider
                        slotBefore={<EditorToolsPopup />}
                        extensions={extensions} content={content}
                    >
                    </EditorProvider>

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
                            <img src="https://images.unsplash.com/photo-1620287341260-a9ecadfe7a17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NjcwNzZ8MHwxfHNlYXJjaHwxfHxibG9nZ3xlbnwwfHx8fDE3NDg0ODIyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="" />
                        </div>
                        <div className="item-input">
                            <input
                                type="text"
                                placeholder="Write a brief description of this image"
                                value={'Laptop and digital icons illustrating autoblogging and content creation.'}
                            />
                        </div>
                    </div>
                    <div className="details-item">
                        <div className="item-head">
                            <div className="head-title">Meta Description</div>
                            <div className="head-actions">
                                <div className="head-actions-item"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.refresh }}
                                ></div>
                                <div className="head-actions-item"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.copy }}
                                ></div>
                            </div>
                        </div>
                        <div className="item-textarea">
                            <textarea name="" id=""
                                value={`Discover how an AI writer elevates BlogSEO strategies for autoblogging success. Automate content, optimize SEO, and grow your blog effortlessly with smart tech.`}
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
                                <Inputs
                                    id="article-settings-length"
                                    type="switch"
                                    width='max'
                                    input_props={{
                                        value: false,
                                        has_option_icon: true,
                                    }}
                                />
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
                                <Inputs
                                    id="article-settings-length"
                                    type="switch"
                                    width='max'
                                    input_props={{
                                        value: false,
                                        has_option_icon: true,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}


export default ContentEditSection