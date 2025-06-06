import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import Buttons from "../../components/Buttons";
import Inputs from "../../components/Inputs";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import TypingMarkdown from '../../components/TypingMarkdown'

/*Constant Data*/
import Languages_Data from "../../data/languages.json";
import Industires_Data from "../../data/industires.json";
import SampleJSON_Data from "../../data/sample_blog.json";

/*Handlers*/
import { BlogAgent as BlogAgentHandler } from '../../Services'

const Index = () => {

  const blogAgentHandler = new BlogAgentHandler()

  const [isLoading, setIsLoading] = useState(false)
  const [warningAlert, setWarningAlert] = useState(false)
  const [warningAlertType, setWarningAlertType] = useState('error')
  const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

  const [Industry, setIndustry] = useState(null);
  const [Category, setCategory] = useState(null);
  const [Language, setLanguage] = useState(null);
  const [Description, setDescription] = useState(null);

  const [GenerateBlogResult, setGenerateBlogResult] = useState(null)

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      industry: Industry,
      category: Category,
      language: Language,
      description: Description,
      format: 'markdown'
    };

    setIsLoading(true)
    let response = await blogAgentHandler.generate(payload)

    setIsLoading(false)

    if (!response.success) {
      setWarningAlert(true)
      setWarningAlertType('error')
      setwarningAlertMessage('Failed to generate, Please try again!')
      return
    }

    setGenerateBlogResult(response.data)

  };

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

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {

      setWarningAlert(true)
      setWarningAlertType('success')
      setwarningAlertMessage('Blog copied to clipboard!')

    }).catch(err => {
      setWarningAlert(true)
      setWarningAlertType('error')
      setwarningAlertMessage(`Error copying the blog!`)
    });
  }
  const handleCreateNew = () => {
    setGenerateBlogResult(null)

    setIndustry(null)
    setCategory(null)
    setLanguage(null)
    setDescription(null)
  }
  const renderBlogResult = (blog) => {

    if (!blog) return ''
    let { think, content } = blog

    let blog_content = `#### Here is your amazing SEO & GEO optimized blog! \n ${content}`


    return (
      <div className="blog_generation-result-main">

        <div className="blog_generation-result-content">
          <div className="blog_generation-result-tools">
            <div className="tools-item"
              onClick={() => handleCopy(content)}
            >
              <div className="tools-item-icon" dangerouslySetInnerHTML={{ __html: Icons.default.copy }}></div>
              <div className="tools-item-label">Copy blog</div>
            </div>
            <div className="tools-item tools-item-primary"
              onClick={() => handleCreateNew()}
            >
              <div className="tools-item-icon" dangerouslySetInnerHTML={{ __html: Icons.default.plus }}></div>
              <div className="tools-item-label">Create New</div>
            </div>
          </div>
          <TypingMarkdown text={blog_content} speed={100} />
        </div>
      </div>
    )
  }


  return (
    <>

      {isLoading ?

        <Loaders
          props={{
            isLabel: true,
            label: 'Generating your blog ....'
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

      <div className="home-container-main">
        {GenerateBlogResult ? renderBlogResult(GenerateBlogResult) :

          <div className="home-container-content">
            <div className="content-head">
              <div className="head-title">
                Turn Your Words into Credible Blog Content
              </div>
              <div className="head-desc">
                Enter your words and hit "Generate" to get Stunning Blog.
              </div>
            </div>
            <form className="content-workspace-main" onSubmit={handleFormSubmit}>
              <div className="workspace-filters">
                <Inputs
                  id="workspace-filter-industry"
                  type="select"
                  width='md'
                  input_props={{
                    value: Industry,
                    options: getIndustries(),
                    placeholder: 'Industry',
                    onChange: setIndustry,
                  }}
                />
                <Inputs
                  id="workspace-filter-category"
                  type="select"
                  width='md'
                  input_props={{
                    value: Category,
                    options: getCategories(Industry),
                    placeholder: "Category",
                    onChange: setCategory,
                  }}
                />
                <Inputs
                  id="workspace-filter-language"
                  type="select"
                  width='md'
                  input_props={{
                    value: Language,
                    options: getLanguages(),
                    placeholder: "Language",
                    onChange: setLanguage,
                  }}
                />
              </div>
              <div className="workspace-textarea-main">
                <Inputs
                  id="workspace-main-input"
                  type="textarea"
                  width='max'
                  input_props={{
                    type: "text",
                    style: {
                      background: 'var(--bg-gray-color)',
                      height: '200px'
                    },
                    value: Description,
                    placeholder: "Describe your blog with keywords",
                    onChange: setDescription,
                  }}
                />
                <Buttons
                  type="primary"
                  width='max'
                  button_type="submit"
                  icon={Icons.default.pilot}
                  label="Generate"
                />
              </div>
            </form>
          </div>
        }
      </div>
    </>
  );
};

export default Index;
