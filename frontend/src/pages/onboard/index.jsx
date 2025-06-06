import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers */
import Utils from "../../helpers/utils";

/*Components*/
import Buttons from "../../components/Buttons";
import Inputs from "../../components/Inputs";
import Steppers from "../../components/Steppers";
import OptionSelectors from "../../components/OptionSelectors";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'

/*handler*/
import AuthHandler from '../../handlers/auth/auth'

/*Custom hook*/
import { useAuth } from "../../hooks/AuthContext";

const Index = () => {

    const { isAuthenticated, OnboardCompleted } = useAuth()

    const navigator = useNavigate()
    const authHandler = new AuthHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('warning')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Failed to onboard")

    const [StepperItems, setStepperItems] = useState([
        {
            id: 'name',
            type: 'text',
            title: 'Let’s start with the basics!',
            placeholder: 'Enter your name or your company’s name',

        },
        {
            id: 'industry',
            type: 'option-selector',
            title: 'Select the one that best fits your niche',
            options: [
                {
                    value: 'Business & Marketing',
                    label: '📈 Business & Marketing',
                },
                {
                    value: 'Construction & Real Estate',
                    label: '🏗️ Construction & Real Estate',
                },
                {
                    value: 'Tech & Software',
                    label: '💻 Tech & Software',
                },
                {
                    value: 'Health & Wellness',
                    label: '🏥 Health & Wellness',
                },
                {
                    value: 'Lifestyle & Home Improvement',
                    label: '🏠 Lifestyle & Home Improvement',
                },
                {
                    value: 'Other',
                    label: 'Other',
                },

            ]
        },
        {
            id: 'target',
            type: 'option-selector',
            title: 'Where do you want your blogs to go?',
            options: [
                {
                    value: 'WordPress',
                    label: '🌐 WordPress',
                },
                {
                    value: 'LinkedIn',
                    label: '📢 LinkedIn',
                },
                {
                    value: 'Medium',
                    label: '📝 Medium',
                },
                {
                    value: 'Twitter/X',
                    label: '🐦 Twitter/X',
                },
                {
                    value: 'Other',
                    label: '📌 Other',
                },

            ]
        },

        {
            id: 'company_size',
            type: 'option-selector',
            title: 'What is the size of your team or organization?',
            options: [
                {
                    value: 'Just me',
                    label: 'Just me',
                },
                {
                    value: '2-9',
                    label: '2-9',
                },
                {
                    value: '10-49',
                    label: '10-49',
                },
                {
                    value: '50-199',
                    label: '50-199',
                },
                {
                    value: '200+',
                    label: '200+',
                },

            ]
        },
        {
            id: 'heard_from',
            type: 'option-selector',
            title: 'How did you hear about us?',
            options: [
                {
                    value: 'X (formerly Twitter)',
                    label: 'X (formerly Twitter)',
                },
                {
                    value: 'LinkedIn',
                    label: 'LinkedIn',
                },
                {
                    value: 'Instagram',
                    label: 'Instagram',
                },
                {
                    value: 'YouTube',
                    label: 'YouTube',
                },
                {
                    value: 'Product Hunt',
                    label: 'Product Hunt',
                },
                {
                    value: 'Email Newsletter',
                    label: 'Email Newsletter',
                },
                {
                    value: 'Influencer or Creator',
                    label: 'Influencer or Creator',
                },
                {
                    value: 'From a friend or colleague',
                    label: 'From a friend or colleague',
                },
            ]
        },
    ])
    let [CompletedSteps, setCompletedSteps] = useState(0)
    const [NextButtonLabel, setNextButtonLabel] = useState('Next step')

    const renderStepperComponent = (idx) => {

        const { id, type, title, placeholder, value = null, options } = StepperItems[idx]

        const handleInputChange = (value) => {

            let _stepperItems = [...StepperItems]
            _stepperItems[idx].value = value
            setStepperItems(_stepperItems)
        }

        const getContent = (type) => {
            if (type == 'text') {
                return <Inputs
                    id={`onboard-${type}-${id}`}
                    type="text"
                    width="max"
                    input_props={{
                        value: value,
                        placeholder: placeholder,
                        onChange: handleInputChange,
                    }}
                />
            }
            else if (type == 'select') {
                return <Inputs
                    id={`onboard-${type}-${id}`}
                    type="select"
                    width="max"
                    input_props={{
                        value: value,
                        options: options,
                        placeholder: placeholder,
                        onChange: handleInputChange,
                    }}
                />
            }
            else if (type == 'option-selector') {
                return <OptionSelectors
                    id={`onboard-${type}-${id}`}
                    value={value}
                    options={options}
                    callback={handleInputChange}
                />
            }
        }


        return (
            <div className="form-content">
                <Steppers
                    steps={StepperItems.length - 1}
                    done={CompletedSteps}
                />
                <div className="form-title">{title}</div>
                {getContent(type)}
            </div>
        )
    }

    const handleSubmit = async () => {

        let details = {}

        StepperItems.forEach(item => {
            details[item.id] = item.value
        })

        let payload = {
            details
        }

        console.log(payload, 'payload');


        setIsLoading(true)

        let response = await authHandler.onboard(payload)

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message || 'Failed to onboard, Please try again!')
            return
        }

        let userdetails = JSON.parse(localStorage.getItem('userdetails') || "{}")
        userdetails.onboarding_status = '1'
        userdetails = JSON.stringify(userdetails)

        localStorage.setItem('userdetails', userdetails)

        navigator('/')

    }
    const handleNextButton = async () => {

        let _completedSteps = CompletedSteps + 1

        if (_completedSteps == StepperItems.length - 1) setNextButtonLabel('Submit')

        if (_completedSteps <= StepperItems.length - 1) setCompletedSteps(_completedSteps)
        else {
            handleSubmit()
        }
    }
    const handleBackButton = () => {
        let _completedSteps = CompletedSteps - 1
        setCompletedSteps(_completedSteps)
    }


    useEffect(() => {
        if (OnboardCompleted) navigator('/', { replace: true })
    }, [OnboardCompleted])

    useEffect(() => {
        console.log(NextButtonLabel, 'NextButtonLabel');

    }, [NextButtonLabel])

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
            <div className="onboard-page-main">
                <section className="onboard-banner">
                    <img
                        className="banner-img"
                        src={Images.Login_Banner}
                        alt="onboard_banner"
                    />
                </section>
                <section className="onboard-container">
                    <div className="container-logo">
                        <img className="logo-img" src={Images.Logo} alt="logo" />
                        <div className="logo-name">Ai SEO Writer</div>
                    </div>
                    <div className="onboard-form-main">
                        {renderStepperComponent(CompletedSteps)}
                        <div className="form-buttons">
                            {CompletedSteps > 0 &&
                                <Buttons
                                    type="default"
                                    width="max"
                                    label="Previous step"
                                    callback={handleBackButton}
                                />
                            }
                            <Buttons
                                type="primary"
                                label={NextButtonLabel}
                                width="max"
                                disable={!StepperItems[CompletedSteps].value}
                                callback={handleNextButton}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Index