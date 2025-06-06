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
        <h2>Understanding the Role of AI Writers in Modern Blogging</h2><p>Artificial intelligence (AI) writers have become instrumental in reshaping how blogs are created, managed, and optimized for search engines. Their capabilities extend far beyond basic text generation, offering significant opportunities for bloggers and content creators to streamline their workflows and improve content quality. AI writers are designed to serve as advanced tools that enhance productivity while ensuring content aligns with SEO best practices.</p><p>At their core, AI writers use sophisticated algorithms based on natural language processing (NLP) and machine learning. These tools analyze vast datasets to identify patterns, styles, and trends, enabling them to craft content that mimics human writing. By leveraging data-driven insights, AI can identify high-performing topics, optimize keyword usage, and enhance readability—all critical elements for achieving strong SEO rankings.</p><h3>Key Functions of AI Writers in Blogging</h3><ul><li><p><strong>Content Creation</strong>: AI writers are adept at generating original blog posts tailored to specific target audiences. With capabilities to understand tone and language preferences, they ensure blogs resonate with readers while adhering to SEO parameters.</p></li><li><p><strong>Keyword Optimization</strong>: These tools can seamlessly integrate keywords into content without compromising flow or readability. Their ability to analyze market trends ensures strategic keyword placement, boosting online visibility.</p></li><li><p><strong>Automation</strong>: For bloggers focused on autoblogging, AI writers can automate the production of consistent, engaging content at scale. This minimizes manual effort while maintaining relevance and quality.</p></li><li><p><strong>Editing and Enhancement</strong>: Many AI tools also provide editing features that refine grammar, sentence structure, and style, making the final content polished and professional.</p></li></ul><p>AI writers play a vital role in enabling bloggers to achieve more with less effort, ultimately driving increased productivity and scalability in content creation. As blogging continues evolving, AI’s contribution will likely grow, offering even more possibilities for innovation and efficiency.</p><h2>What is Autoblogging and Why It Matters for Content Creators</h2><p>Autoblogging refers to the practice of setting up a website or blog that automatically generates and publishes content. This is accomplished using software, plugins, or tools that scrape, curate, or create content from various sources and post it on the blog with minimal manual intervention. While some approaches to autoblogging are focused on copying content verbatim, modern autoblogging often leverages AI, algorithms, and ethical practices to ensure originality, relevance, and value for users.</p><p>Content creators benefit from autoblogging as it provides a scalable way to maintain a consistent publishing schedule. For example, traditional blogging requires significant effort to research, draft, and produce content. By automating parts of this process, autoblogging saves time and streamlines content production. Additionally, autoblogging supports creators by allowing them to cover trending topics quickly, aggregate niche-specific information, or even repurpose their existing content.</p><p>Autoblogging relies on tools that can integrate with third-party platforms, apply search engine optimization (SEO) practices, and format posts professionally. Common features include keyword-based content generation, integration with RSS feeds, and advanced scheduling. This technical foundation ensures that autoblogged websites remain competitive and up-to-date, especially in fast-paced industries like technology or finance.</p><p>The relevance of autoblogging has grown as competition in online media intensifies. Content creators need strategies to maintain visibility, especially in search engine rankings. When paired with robust SEO practices, autoblogging positions creators as consistent and credible sources of information—an essential element for thriving in today’s digital-first economy. By understanding autoblogging, creators can harness its potential to amplify their reach and efficiency while catering to their audience’s needs.</p><h2>The Intersection of AI Writers and SEO: A Powerful Combination</h2><p>The collaboration between AI writers and SEO strategies represents a transformative shift in digital content creation. AI-powered tools have the capacity to analyze extensive data sets, integrate SEO best practices, and generate quality content at scale. SEO, in turn, provides the framework to ensure this content aligns with search engine algorithms, reaching the right audience effectively.</p><p>AI-driven systems excel in keyword research and semantic analysis. These technologies identify primary and secondary keywords, assess keyword density, and suggest optimal placements across a blog post. By incorporating Latent Semantic Indexing (LSI) keywords, AI writers can craft content that not only ranks higher but stays relevant to user intent. This ensures the content resonates with both search engines and human readers.</p><p>One of the significant benefits of AI in SEO optimization is speed. While manual keyword research and content structuring can take hours, an AI writer can accomplish these tasks in minutes. By leveraging natural language processing (NLP), these tools can mimic human tone, address pain points, and improve readability while upholding SEO guidelines.</p><p>Beyond keyword precision, AI writers can generate meta descriptions, optimize headings, and suggest internal or external linking opportunities. Integrating AI ensures each piece of content adheres to on-page optimization standards, further enhancing its ranking potential.</p><p>Additionally, AI writers contribute to data-driven decision-making. Tools can provide insights into trending topics, user preferences, and competitor analysis, assisting bloggers in staying ahead of industry shifts. This fusion of AI and SEO enables autoblogging to become more strategic and sustainable, encouraging long-term success.</p><p>Through techniques like predictive analytics and content automation, the synergy between AI writers and SEO bolsters a blog’s visibility, saving time and resources while amplifying overall performance. As such, the combination underpins a powerful interplay between technology and strategy in today’s digital landscape.</p><h2>How AI Enhances Keyword Research for High-Ranking Content</h2><p>AI technology significantly transforms the keyword research process, offering tools that can analyze massive datasets and uncover high-potential keywords more efficiently than manual methods. With the integration of natural language processing (NLP) and machine learning, AI enables a deeper understanding of user intent and search behavior, helping content creators build strategies tailored to their audiences.</p><p>AI-powered platforms can identify keyword trends by analyzing real-time search queries, industry-specific topics, and competitive landscapes. This allows blog creators to capitalize on emerging opportunities and create content that aligns with what users are actively searching for. Additionally, AI models can suggest long-tail keywords, which often have lower competition and higher conversion potential, leading to improved rankings.</p><p>AI tools also rank keyword relevance by examining metrics like search volume, competition level, and click-through rates. They can evaluate clusters of related search terms, ensuring a comprehensive approach to topic coverage. For example, semantic keyword analysis identifies variations and synonyms, enabling bloggers to structure their content for broader visibility without cannibalizing rankings.</p><p>Another way AI enhances keyword research is through predictive analysis. With advanced algorithms, AI can forecast future keyword trends, helping create evergreen content that retains its relevance over time. These insights save valuable time and resources while delivering data-backed decisions.</p><p>Moreover, AI integrates with SEO platforms to monitor ranking performance continuously. By adapting keyword strategies based on real-time data, blogs remain competitive in search engine results pages (SERPs). This dynamic optimization ensures sustained traffic growth and improved website authority.</p><h2>Optimizing Post Structure and Readability with AI Automation</h2><p>An AI writer significantly enhances blog SEO by streamlining post structure and improving readability. Effective content structure is essential for engaging both search engines and readers. AI automation excels in organizing posts logically, ensuring clear headings, subheadings, and properly nested content to create a hierarchy that aligns with best SEO practices.</p><p>AI algorithms are designed to recognize attention span patterns and information absorption trends. Consequently, they tailor content to include concise paragraphs, bullet points, and easy-to-digest formatting. By introducing these features automatically, posts become more visually appealing and accessible. For instance, AI tools leverage natural language processing to detect where dividing content into smaller sections or lists can improve engagement.</p><p>Moreover, AI automates practices such as keyword placement, ensuring critical terms are introduced naturally within headers, introductions, and throughout the text. This structured approach not only boosts rankings but also keeps the content from appearing keyword-stuffed or robotic, maintaining a balance between SEO optimization and readability. AI tools often go a step further, actively suggesting synonyms or variations of repetitive phrases to enhance the flow of writing.</p><p>Another aspect AI refines is aligning content tone with intended audiences. By analyzing target demographic data, such technology can adapt sentence complexity, vocabulary, and style to resonate with readers. For blogs targeting broader or non-technical audiences, AI ensures higher Flesch reading ease scores without compromising informational value.</p><p>Through its ability to simulate audience behavior, AI also adjusts formatting choices, such as laying out CTAs (Calls to Action) strategically to influence reader interaction positively. This seamless integration of structure and clarity ensures maximum reader retention and improved SEO outcomes for consistent autoblogging success.</p><h2>Effortless Content Generation: Saving Time and Boosting Productivity</h2><p>Integrating AI writing tools into autoblogging workflows streamlines content creation, allowing bloggers to generate high-quality posts with minimal effort. By leveraging natural language processing and machine learning, AI writers craft articles that are not only coherent but also tailored to specific topics, keywords, and audience preferences. This automation eliminates the need for bloggers to spend hours brainstorming, researching, and drafting, freeing up valuable time for other strategic activities.</p><p>AI writers assist in developing content quickly, offering features such as topic suggestions, meta description generation, and even automatic formatting. These tools can generate a continuous stream of blog posts, ensuring consistent publication schedules, which are essential for maintaining audience engagement and enhancing search engine rankings. The precision with which these platforms analyze input data ensures relevance, helping blogs align with trending topics or niche markets.</p><p>Using AI eliminates common bottlenecks in the creative process. Writers often face challenges like writer’s block, which can delay content production. AI-powered solutions bypass these struggles by producing drafts almost instantly, enabling faster edits and a smoother workflow. This efficiency makes AI tools particularly valuable for teams managing multiple blogs or large-scale content projects.</p><p>Moreover, AI-generated content can easily be scaled to meet growing demands. Whether expanding to new market segments or optimizing existing blogs, AI simplifies scaling by producing high volumes of quality material. Bloggers can also adapt tone, style, or keyword focus, ensuring each post resonates with its intended audience without compromising productivity.</p><p>By automating repetitive tasks, AI empowers bloggers to concentrate on strategic decision-making, creativity, and analytics. The integration of these tools into an autoblogging strategy enhances overall operational efficiency, positioning blogs for sustainable growth and long-term success.</p><h2>Utilizing AI to Stay Ahead of Algorithm Updates and Trends</h2><p>Search engine algorithms are dynamic, continuously evolving in response to changing user behavior and technological progress. Staying ahead of these updates is critical for maintaining strong search engine rankings. AI-powered writing tools offer a distinct advantage by analyzing search trends, understanding algorithm updates, and adapting content strategies accordingly.</p><p>AI systems leverage real-time data analysis to track fluctuations in search engine algorithms. These tools monitor changes such as keyword weightage, content structure preferences, and user intent refinements, providing insights that help bloggers adjust their efforts proactively. Unlike manual monitoring, AI can process vast datasets at lightning speed and extract actionable insights, ensuring content aligns with current standards.</p><p>AI writing tools also enhance trend prediction by identifying patterns in audience interests and online behavior. They provide keyword and title suggestions based on emerging search queries. Their ability to recommend content structures optimized for snippet inclusion or voice search further increases the likelihood of ranking higher. For example, AI can suggest crafting FAQs or bulleted lists to cater to featured snippet opportunities.</p><p>Furthermore, these tools enable bloggers to automate the tedious process of ensuring compliance with search engine guidelines. They evaluate factors such as readability, mobile-friendliness, and proper use of metadata, then make adjustments to meet the latest optimization criteria. AI thereby reduces the time and effort required to maintain SEO compliance, letting creators focus more on quality.</p><p>Incorporating AI into blogging workflows ensures that content not only reacts to but also anticipates algorithmic changes. This proactive strategy safeguards rankings while capitalizing on new opportunities arising from industry shifts.</p><h2>Ensuring Authenticity and Originality in AI-Generated Content</h2><p>A critical component of leveraging AI in autoblogging revolves around maintaining authenticity and originality. The automated writing process can sometimes generate repetitive or derivative content, which risks tarnishing a blog’s credibility and potentially penalizing its search rankings. Therefore, safeguards and strategies must be employed to uphold uniqueness while utilizing AI writing.</p><p>Firstly, AI tools should be configured to produce content specifically aligned with target audience interests and the blog’s niche, ensuring relevance. Employing advanced algorithms capable of semantic understanding can help produce content that resonates with readers while avoiding generic outputs. AI can also incorporate personality and tone reflective of the brand identity, lending a signature voice to the writing.</p><p>Furthermore, originality can be achieved through the integration of multi-source data. Feeding AI models with information from reputable and varied sources enables crafting fresh perspectives, rather than regurgitating common knowledge. Complementing this process with human oversight can further refine the content by checking for duplications, errors, and alignment with overall objectives.</p><p>AI-based plagiarism detection tools also play a pivotal role in guaranteeing authenticity. These tools can scan and verify that the outputs are unique, minimizing the risks of inadvertently publishing duplicate material. Additionally, transparency in citing sources ensures ethical practices, especially when AI incorporates research from external materials.</p><p>Finally, iterative feedback mechanisms enhance quality. Blogs can utilize reader engagement analytics to assess whether content feels authentic and valuable. Paired with manual reviews, this data allows AI models to better tailor their outputs, making continuous improvements while upholding originality. Such practices ensure long-term success in autoblogging.</p><h2>AI-Powered Tools for Monitoring Performance and Analytics</h2><p>AI-powered tools have revolutionized the way performance and analytics are monitored in autoblogging. These advanced systems work seamlessly to provide actionable insights that can enhance decision-making, ultimately driving SEO-focused content strategies. By leveraging artificial intelligence, bloggers can streamline their workflow, measure success more effectively, and optimize their efforts to reach target audiences.</p><p>One key benefit of AI-driven performance monitoring tools is their ability to analyze vast amounts of data in real-time. They can extract metrics that relate to blog traffic, user engagement, bounce rates, and conversion rates, providing a comprehensive overview of how content is performing. This allows users to identify patterns and trends that would otherwise be difficult to discern manually, ensuring every piece of content aligns with audience preferences and search engine requirements.</p><p>Modern AI analytics tools often provide features such as custom dashboards for visualizing key performance metrics. These dashboards can display information like keyword rankings, backlink data, and page load speeds, which are critical for SEO success. The ability to have a centralized location to monitor multiple performance indicators helps bloggers make informed adjustments to content strategy over time.</p><p>AI also plays an indispensable role in predictive analytics, enabling bloggers to anticipate trends and plan their content accordingly. Tools integrated with machine learning can forecast what topics are likely to trend based on data from social media activity, search engine patterns, or competitor content. This ensures content remains relevant and competitive within the shifting digital landscape.</p><p>Furthermore, the automation capabilities of AI analytics tools reduce the burden of manual reporting. Instead of spending hours compiling data, these tools automatically generate reports with actionable recommendations. This not only saves time but also enhances accuracy, ensuring decisions are based on reliable data insights.</p><p>An additional feature of AI tools for performance analytics is their adaptability to personalization. These systems can analyze individual user behavior, helping bloggers understand audience segments and tailor content accordingly. Personalization increases the likelihood of engagement, clicks, and conversions, creating a more impactful blogging experience.</p><p>By integrating AI-driven tools into their workflow, autobloggers can maintain a consistent and data-backed approach to improving their digital presence. These tools empower them to continuously refine their strategies by delivering deeper insights and reducing inefficiencies.</p><h2>Scaling Your Blog with AI-Driven Content Strategies</h2><p>Harnessing artificial intelligence to scale a blog involves leveraging advanced algorithms and machine learning models designed to optimize content creation, distribution, and performance analytics. AI-driven content strategies empower bloggers to maximize efficiency, expand their reach, and produce relevant, impactful posts tailored to specific audiences. This approach is particularly beneficial for autoblogging, where consistency and volume are critical for success.</p><p>AI tools excel in analyzing data and identifying trends within a niche. They scan vast repositories of information, including competitor blogs, social media platforms, and trending keywords, to pinpoint actionable opportunities. Bloggers can use this data to develop targeted content that aligns with the audience's preferences and expectations, improving engagement rates and reducing bounce rates. AI enables quick adaptation to evolving trends, ensuring the blog remains relevant amid dynamic market conditions.</p><p>Automation plays a central role in scaling efforts. AI-powered content management systems streamline repetitive tasks such as keyword optimization, meta description creation, and headline generation. Bloggers can programmatically schedule posts, ensuring consistent output without the need for manual intervention. This allows for a strategic focus on higher-value activities such as audience interaction and community building while eliminating inefficiencies related to content production.</p><p>Content personalization is another cornerstone of AI-driven strategies. The technology evaluates user behaviors, demographics, and preferences to curate highly customized reading experiences. Segmentation tools powered by AI can deliver personalized recommendations, tailored newsletters, or specific action prompts designed to engage subscribers and convert casual readers into loyal followers. Such precision fosters trust and strengthens the visitor-blogger relationship.</p><p>Further enhancement is achieved through performance tracking and predictive analytics. AI programs can evaluate page views, click-through rates, and SEO rankings in real time. By interpreting these metrics, bloggers gain actionable insights into areas for improvement, such as page design, internal linking structures, or keyword density. Machine learning models anticipate future trends, allowing preemptive adjustments to stay ahead of the curve.</p><p>AI-driven strategies also facilitate the development of multilingual content. Translation engines integrated into AI systems enable bloggers to reach global audiences by creating content in multiple languages with remarkable fluency and cultural nuance. Distributing posts internationally widens audience bases and opens doors to collaborations and sponsorships on a broader scale, effectively elevating brand visibility.</p><p>Ultimately, scaling with AI empowers bloggers to produce high-quality content at scale while maintaining relevancy and efficiency in a competitive digital landscape. Embracing the capabilities of AI truly positions bloggers for lasting autoblogging success.</p><h2>Balancing Automation and Human Touch for Sustained Success</h2><p>While AI writers have become a cornerstone for optimizing blogSEO in autoblogging, achieving sustained success relies on striking the right balance between automation and human input. Automation, primarily through AI tools, offers efficiency, scalability, and the ability to produce SEO-optimized content in record time. However, excessive reliance on fully automated processes can result in a lack of originality, coherence, or the nuanced understanding of audience needs that only human touch can provide.</p><p>AI systems excel at identifying trending keywords, structuring content, and ensuring compliance with best SEO practices. They can analyze vast datasets and craft blog posts tailored to ranking algorithms. However, to maintain authenticity and foster audience engagement, human reviewers should oversee the editorial process. Reviewers can fine-tune language, reinforce brand tone, and incorporate storytelling elements that resonate emotionally with readers.</p><p>Two critical aspects require particular attention in this collaboration between AI and humans:</p><ul><li><p><strong>Content Authenticity</strong>: Readers often recognize and feel disconnected from overly robotic text. Through human editing, bloggers can ensure that the generated content aligns with their unique brand voice and maintains relatability.</p></li><li><p><strong>Audience-Centric Value</strong>: Human marketers have an edge in understanding audience psychology, user intent, and cultural or topical sensitivities. These insights enhance an AI's output, ensuring it focuses on providing meaningful value.</p></li></ul><p>To successfully balance both, organizations should adopt a hybrid approach. By allowing AI to handle repetitive tasks like keyword integration and predictive insights while entrusting humans with creativity and empathy, the final result delivers substance without sacrificing efficiency. Consequently, this partnership not only enhances blogSEO performance but also helps retain a loyal and engaged reader base.</p><h2>Future Trends: AI's Continuing Influence on Blogging and SEO</h2><p>The evolution of artificial intelligence is positioned to redefine the blogging and SEO landscapes further. As natural language processing (NLP) and machine learning algorithms grow more sophisticated, AI tools are predicted to play an even greater role in content creation and optimization.</p><p>Emerging advancements in AI-powered content analysis will enable more granular insights into audience preferences and behaviors. This shift is expected to enhance personalization in blog posts, tailoring tone, format, and subject matter based on reader profiles. AI-driven tools will analyze engagement metrics in real time, paving the way for blogs to adapt dynamically to audience needs, driving higher reader retention.</p><p>Search engine algorithms are anticipated to increasingly prioritize user intent over specific keywords. This trend will likely result in AI tools focusing on semantic relevance and context as foundational elements of SEO strategies. The demand for AI-based systems capable of understanding conversational queries and delivering well-optimized, high-quality replies will rise in tandem with advancements in voice search technology.</p><p>With AI tools streamlining tedious tasks such as keyword research, trend analysis, and competitor monitoring, bloggers will gain more time to focus on creative storytelling and strategic planning. Generative AI tools are expected to offer diverse, innovative content formats, including interactive infographics and videos, to cater to modern audience preferences.</p><p>AI’s ability to simulate human emotions and language will continue improving, reducing the gap between human-written and machine-generated content. Over time, AI writers may deliver hyper-localized and culturally nuanced blogs that resonate deeply with specific audiences.</p><p>As regulatory landscapes evolve to keep pace with AI technologies, accountability in AI-generated content will become a focus. Ethical considerations, including transparency in labeling AI-written blogs and adherence to SEO guidelines, will influence how technologies are adopted across the industry. In this way, the partnership between bloggers, AI, and SEO will continue to evolve in response to technological and societal changes.</p>
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