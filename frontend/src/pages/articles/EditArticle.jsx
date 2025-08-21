import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Buttons from '../../components/Buttons'
import Stepper from "../../components/Stepper";

import { saveAs } from "file-saver";
import { marked } from "marked";
import htmlDocx from "html-docx-js/dist/html-docx";


/*handler*/
import ArticlesHandler from '../../handlers/articles/articles'
import PlatformHandler from '../../handlers/platform/platform'

/* Sup Components */
import TitleEditSection from './TitleEditSection'
import ContentEditSection from './ContentEditSection'

const EditArticle = () => {

    const navigator = useNavigate()
    const articlesHandler = new ArticlesHandler()
    const platformHandler = new PlatformHandler()

    const { id } = useParams()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const handleClose = () => {
        return navigator(-1)
    }

    const [Generating, setGenerating] = useState(false);
    const [GenerationDone, setGenerationDone] = useState(false);
    const [GeneratingPercent, setGeneratingPercent] = useState(0);
    const [GeneratingLabel, setGeneratingLabel] = useState('Generating your article');
    const [CurrentStep, setCurrentStep] = useState(0);
    const [DiscardChanges, setDiscardChanges] = useState(false)
    const [SaveChanges, setSaveChanges] = useState(false)
    const [HasChanges, setHasChanges] = useState(false)

    const [ShowPublishPopup, setShowPublishPopup] = useState(false)
    const [PublishToApps, setPublishToApps] = useState([
        {
            id: 'linkedin',
            img: Images.apps.Linkedin,
            name: 'LinkedIn',
            desc: `Boost your blog automation with seamless platform integration`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'ghost',
            img: Images.apps.Ghost,
            name: 'Ghost',
            desc: `Seamlessly integrate your AI articles with Ghost’s blogging platform.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'wordpress',
            img: Images.apps.Wordpress,
            name: 'Wordpress',
            desc: `Instantly publish to WordPress.com with our integration.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'wordpress.org',
            img: Images.apps.Wordpress_org,
            name: 'Wordpress Org',
            desc: `Easily connect and push content to your WordPress.org site.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'notion',
            img: Images.apps.Notion,
            name: 'Notion',
            desc: `Publish AI-generated articles directly to your Notion workspace.`,
            has_connected: false,
            has_settings: true,
        },
        {
            id: 'webflow',
            img: Images.apps.Webflow,
            name: 'Webflow',
            desc: `Streamline your content flow into Webflow with one click.`,
            has_connected: false,
            has_settings: true,
        }
    ])
    const [ExportOptions, setExportOptions] = useState([
        {
            id: 'word',
            icon: Icons.default.file,
            name: 'Download as Word (.docx)'
        },
        {
            id: 'html',
            icon: Icons.default.file,
            name: 'Download as Webpage (.html)'
        },
        {
            id: 'markdown',
            icon: Icons.default.file,
            name: 'Download as Markdown (.md)'
        },
    ])

    const StepperItems = [
        { title: 'Title & Outline', disable: Generating },
        { title: 'Article & SEO', disable: Generating }
    ]
    const onStepperChange = val => {

        if (val == '0') setCurrentStep(val)
        else if (val == '1' && GenerationDone) setCurrentStep(val)
    }


    const handleGenerateTitle = async (data) => {
        setCurrentStep(1)
        setGenerating(true)
        setGenerationDone(false)
        await generateContent(data)
    }

    const [Article, setArticle] = useState(undefined)

    const getArticle = async (id) => {

        setIsLoading(true)
        let response = await articlesHandler.get({ id })
        setIsLoading(false)
        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            navigator(-1)
            return
        }

        const article = response.data[0]

        if (!article) return
        setArticle(article)

        if (article.status == '1') {
            if (article.content) setCurrentStep(1)
            setGenerationDone(true)
        }

    }

    const generateContent = async (data) => {
        let response = await articlesHandler.generate_content(data)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        const article_content = response.data.content
        const cover_image = response.data.cover_image

        setArticle(prev => ({
            ...prev,
            content: article_content,
            cover_image: cover_image
        }))

        setGenerationDone(true)
        setGenerating(false)
    }

    const handleSaveChanges = async () => { }

    const handleShowPulishPopup = () => {
        setShowPublishPopup(!ShowPublishPopup)
    }

    const exportAsWord = () => {
        try {
            const { title, content, cover_image, meta_description, article_schema, faq_schema } = Article

            const htmlContent = marked.parse(content);

            const fullHTML = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8" />
                  <title>Export</title>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    h1, h2, h3 { font-weight: bold; }
                    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; }
                    code { font-family: monospace; }
                  </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <br />
                    <br />
                    ${htmlContent}
                    ${meta_description ? `
                        <br />
                        <br />
                        <hr contenteditable="false"/>
                        <div>
                            <h4>Meta Description</h4>
                            <div>${meta_description}</div>
                        </div>    
                    ` : ''}
                    ${article_schema ? `
                        <br />
                        <br />
                        <hr contenteditable="false"/>
                        <div>
                            <h4>Article Schema</h4>
                            <div>${JSON.stringify(article_schema)}</div>
                        </div>    
                    ` : ''}
                    ${faq_schema ? `
                        <br />
                        <br />
                        <hr contenteditable="false"/>
                        <div>
                            <h4>Article Schema</h4>
                            <div>${JSON.stringify(faq_schema)}</div>
                        </div>    
                    ` : ''}
                </body>
              </html>
            `;

            const docxBlob = htmlDocx.asBlob(fullHTML);

            saveAs(docxBlob, title);
        } catch (error) {
            console.error("Error exporting Word file:", error);
        }
    }
    const exportAsHTML = () => {
        try {
            const { title, content, meta_description, article_schema, faq_schema } = Article;

            const htmlContent = marked.parse(content);

            const fullHTML = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8" />
                  <title>${title}</title>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    h1, h2, h3 { font-weight: bold; }
                    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; }
                    code { font-family: monospace; }
                  </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <br /><br />
                    ${htmlContent}
                    ${meta_description ? `
                        <br /><br />
                        <hr />
                        <div>
                            <h4>Meta Description</h4>
                            <div>${meta_description}</div>
                        </div>` : ''}
                    ${article_schema ? `
                        <br /><br />
                        <hr />
                        <div>
                            <h4>Article Schema</h4>
                            <div>${JSON.stringify(article_schema)}</div>
                        </div>` : ''}
                    ${faq_schema ? `
                        <br /><br />
                        <hr />
                        <div>
                            <h4>FAQ Schema</h4>
                            <div>${JSON.stringify(faq_schema)}</div>
                        </div>` : ''}
                </body>
              </html>
            `;

            const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
            saveAs(blob, `${title}.html`);
        } catch (error) {
            console.error("Error exporting HTML file:", error);
        }
    };
    const exportAsMarkdown = () => {
        try {
            const { title, content, meta_description, article_schema, faq_schema } = Article;

            let markdownContent = `# ${title}\n\n${content}\n`;

            if (meta_description) {
                markdownContent += `\n---\n**Meta Description:**\n${meta_description}\n`;
            }

            if (article_schema) {
                markdownContent += `\n---\n**Article Schema:**\n\`\`\`json\n${JSON.stringify(article_schema, null, 2)}\n\`\`\`\n`;
            }

            if (faq_schema) {
                markdownContent += `\n---\n**FAQ Schema:**\n\`\`\`json\n${JSON.stringify(faq_schema, null, 2)}\n\`\`\`\n`;
            }

            const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
            saveAs(blob, `${title}.md`);
        } catch (error) {
            console.error("Error exporting Markdown file:", error);
        }
    };

    const handleExport = (type) => {
        if (type == 'word') exportAsWord()
        if (type == 'html') exportAsHTML()
        if (type == 'markdown') exportAsMarkdown()

    }

    const handlePublish = async (platform) => {

        const payload = {
            article_id: id,
            platform: platform
        }

        setIsLoading(true)
        let response = await platformHandler.post(payload)
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

    const PublishPopup = () => {


        return (
            <div className="publish-popup-main">
                <div className="section-main">
                    <div className="section-head">
                        <div className="title">Choose platform to share:</div>
                        <div className="actions">
                            <Link to={'/integration'} target="_blank" className="actions-btn"
                            >
                                <div className="icon"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.plus }}
                                ></div>
                                <div className="label">Add</div>
                            </Link>
                        </div>
                    </div>
                    <div className="section-items">
                        {PublishToApps?.map((app, idx) => (
                            <div
                                key={`publish-platform-app-${idx}`}
                                className="section-item"
                                style={{
                                    width: '48%'
                                }}
                                onClick={() => handlePublish(app.id)}
                            >
                                <img className="img" src={app.img} />
                                <div className="label">{app.name}</div>
                            </div>

                        ))}
                    </div>
                </div>
                <div className="section-main">
                    <div className="section-head">
                        <div className="title">Download</div>
                    </div>
                    <div className="section-items">
                        {ExportOptions?.map((app, idx) => (
                            <div
                                key={`publish-export-option-${idx}`}
                                className="section-item"
                                onClick={() => handleExport(app.id)}
                            >
                                <div className="icon"
                                    dangerouslySetInnerHTML={{ __html: app.icon }}
                                ></div>
                                <div className="label">{app.name}</div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        )
    }


    useEffect(() => {
        getArticle(id)

    }, [])

    useEffect(() => {
        if (!Generating) return;

        const interval = setInterval(() => {
            setGeneratingPercent((prev) => {

                console.log(prev, prev == 99, GenerationDone, 'GenerationDone');


                if (prev == 99 && !GenerationDone) {
                    return prev; // Stop at 99% until GenerationDone
                }

                if (GenerationDone && prev < 100) {
                    return prev + 1; // Final push to 100%
                }

                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }

                return prev + 1;
            });
        }, 150);

        return () => clearInterval(interval);
    }, [Generating, GenerationDone]);


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



            <div className="article-page-main">
                <div className="article-page-header">
                    <Buttons
                        type={'outline'}
                        icon={Icons.default.back_arrow}
                        width={'auto'}
                        label={'Back'}
                        callback={handleClose}
                    />
                    <Stepper
                        active={CurrentStep}
                        steps={StepperItems}
                        callback={onStepperChange}
                    />
                    {HasChanges ?
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '14px'
                        }}>
                            <Buttons
                                type="default"
                                width="auto"
                                label="Discard"
                                callback={() => setDiscardChanges(true)}

                            />
                            <Buttons
                                type="primary"
                                width="auto"
                                label="Save Changes"
                                callback={() => setSaveChanges(true)}
                            />

                        </div>
                        :
                        <>
                            <Buttons
                                type="primary"
                                icon={Icons.default.export}
                                width="auto"
                                label="PublishArticle"
                                disable={Generating}
                                callback={handleShowPulishPopup}
                            />
                            {ShowPublishPopup ? PublishPopup() : null}
                        </>
                    }


                </div>
                {Generating ?
                    <div className="article-content-generating">
                        <Loaders
                            props={{
                                has_wrapper: false,
                                label: GeneratingLabel,
                                isLabel: true,
                                percentage: `${GeneratingPercent}%`
                            }} />

                    </div>
                    : CurrentStep == 1 && GenerationDone ?
                        <ContentEditSection data={Article} saveChanges={SaveChanges} discardChanges={DiscardChanges} set_hasChanges={setHasChanges} />
                        : <TitleEditSection data={Article} callback={handleGenerateTitle} />
                }
            </div>

        </>
    )
}

export default EditArticle;