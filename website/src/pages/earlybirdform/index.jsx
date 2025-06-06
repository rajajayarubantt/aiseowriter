import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

/*Helpers */
import Utils from "../../helpers/utils";

/*Component */
import PopupWrapper from '../../components/Popup/Wrapper'
import PopupContainer from '../../components/Popup/Container'
import Buttons from '../../components/Buttons'
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'

/*handler*/
import EarlybirdsHandler from '../../handlers/earlybirds/earlybirds'

const Index = () => {

    const navigator = useNavigate()

    const [searchParams] = useSearchParams();


    const earlybirdsHandle = new EarlybirdsHandler()

    const [Email, setEmail] = useState('')
    const [EmailInvalid, setEmailInvalid] = useState(false);

    const [EmailDeBounce, setEmailDeBounce] = useState(null)
    const [EmailDeBounce_Delay, setEmailDeBounce_Delay] = useState(1000)

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('warning')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Something went wrong")

    const [SubmitionDone, setSubmitionDone] = useState(false)

    const [Params, setParams] = useState({})

    useEffect(() => {

        const params = ['price_id', 'price_duration']
        const getParams = (key) => searchParams.get(key)


        const params_data = {}

        params.forEach((param, idx) => {
            params_data[param] = getParams(param)
        })

        setParams(params_data)

    }, [searchParams])

    const ValidateForm = (email) => {
        if (email) setEmailInvalid(!Utils.validateEmailFormat(email));
    };


    const handleInputChange = (e) => {
        let value = e.target.value
        setEmail(value)

        if (EmailDeBounce) clearTimeout(EmailDeBounce)

        setEmailDeBounce(setTimeout(() => ValidateForm(value), EmailDeBounce_Delay))
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (EmailInvalid) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage('Please enter valid email!')
            return
        }

        let payload = {
            email: Email,
        }

        if (Params) payload['params'] = JSON.stringify(Params)


        setIsLoading(true)

        let response = await earlybirdsHandle.create(payload)

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message || 'Failed to create, Please try again!')
        }


        setSubmitionDone(true)
        // navigator('/')

    }


    const handleClose = () => {
        navigator('/')
    }

    const renderThanksScreen = () => {



        return (
            <div className="earlybirdform-main">
                <div className="earlybirdform-logo" style={{
                    width: '100px',
                    height: '100px',
                }}>
                    <img src={Images.tick_gif} />
                </div>
                <div className="earlybirdform-head">
                    <div className="head-title">You're In! Welcome to ZenBlogs ai 🚀</div>
                    <div className="head-desc">
                        Thanks for signing up early! You're officially on the list to get lifetime access at the best price.
                        We'll notify you as soon as we launch.
                    </div>
                </div>
                <div className="earlybirdform-tags">
                    <div className="earlybirdform-tag">Congrats! You’ve joined 1,000+ early adopters</div>
                </div>
                <div className="earlybirdform-actions">
                    <Buttons
                        width='auto'
                        type='danger'
                        label='Close me'
                        callback={handleClose}
                    />
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
                        callback: (confirmation) => setWarningAlert(false)
                    }} />
                : null}

            <PopupWrapper>
                <PopupContainer
                    _style={{
                        width: 'var(--popup-width-md)',
                        minHeight: 'var(--popup-height-md)',
                        height: 'max-content'
                    }}
                    has_header={false}
                    has_close={false}
                >
                    {SubmitionDone ? renderThanksScreen()
                        :
                        <form className="earlybirdform-main" onSubmit={handleSubmit}>
                            <div className="earlybirdform-logo">
                                <img src={Images.Logo} />
                            </div>
                            <div className="earlybirdform-head">
                                <div className="head-title">Get Early Access to ZenBlogs ai</div>
                                <div className="head-desc">
                                    Autopilot your blog with Ai generated, schedule & publish effortlessly.
                                    Join now to unlock lifetime access at founder pricing.
                                </div>
                            </div>
                            <div className="earlybirdform-input-main">
                                <div className={`earlybirdform-input-item`}>
                                    <label htmlFor="earlybirdform-input-email input-required">Email Address</label>
                                    <input
                                        id="earlybirdform-input-email"
                                        className={`${EmailInvalid && 'input-invalid'}`}
                                        type="email"
                                        placeholder='you@example.com'
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                </div>
                            </div>
                            <div className="earlybirdform-actions">
                                <Buttons
                                    width='max'
                                    type='primary'
                                    button_type="submit"
                                    icon={Icons.default.rocket}
                                    label='Unlock Early Access'
                                />
                            </div>
                            <div className="earlybirdform-tags">
                                <div className="earlybirdform-tag">Over 1,000+ already joined</div>
                            </div>
                        </form>
                    }

                </PopupContainer>
            </PopupWrapper>
        </>
    )
}

export default Index;