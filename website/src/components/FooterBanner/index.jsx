import React from "react";
import { useNavigate } from "react-router-dom";


/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

/*Component */
import ButtonsWrapper from '../ButtonsWrapper'
import Buttons from '../Buttons'
import BotPatternBG from '../BotPatternBG'

const Index = () => {

    const navigator = useNavigate()


    const handleRedirection = (url) => {
        navigator(url)
    }

    return (
        <div className="footer_banner-wrapper-main">
            <BotPatternBG />
            <div className="footer_banner-wrapper-content">
                <div className="content-subtitle animation-appear-container">
                    <img className="subtitle-logo" src={Images.Logo} alt="logo" />
                    <div className="subtitle-label">Zenblogs AI</div>
                </div>
                <div className="content-title animation-appear-container">Start for free, today.</div>
                <div className="content-steps animation-appear-container">
                    <div className="steps-item">
                        <div className="item-icon"
                            dangerouslySetInnerHTML={{ __html: Icons.default.tick }}
                        ></div>
                        <div className="item-label">Join early bird</div>
                    </div>
                    <div className="steps-item">
                        <div className="item-icon"
                            dangerouslySetInnerHTML={{ __html: Icons.default.tick }}
                        ></div>
                        <div className="item-label">Get lifetime offer</div>
                    </div>
                    <div className="steps-item">
                        <div className="item-icon"
                            dangerouslySetInnerHTML={{ __html: Icons.default.tick }}
                        ></div>
                        <div className="item-label">Publish blog —No Hassle</div>
                    </div>
                </div>
                <ButtonsWrapper
                    classes="animation-appear-container"
                >

                    <Buttons
                        width='auto'
                        type='dark'
                        icon={Icons.default.rocket}
                        label='Get Early Access!'
                        callback={() => handleRedirection('/early-bird-program')}
                    />
                    <Buttons
                        width='auto'
                        type='outline'
                        icon={Icons.default.circle_play}
                        label='Watch demo'
                    />

                </ButtonsWrapper>

            </div>
        </div>
    )
}

export default Index;