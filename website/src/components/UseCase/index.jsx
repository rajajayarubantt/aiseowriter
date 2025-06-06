import React, { useState } from "react";



import ButtonsWrapper from '../ButtonsWrapper'
import Buttons from '../Buttons'

const Index = ({ header = {}, usecases = [], banner = null }) => {

    const [UseCases, setUseCases] = useState(usecases || [])

    return (
        <div className="usecase-wrapper-main">
            <div className="usecase-header">
                {header?.subtitle && <div className="header-subtitle animation-appear-container" dangerouslySetInnerHTML={{ __html: header.subtitle }}></div>}
                {header?.title && <div className="header-title animation-appear-container" dangerouslySetInnerHTML={{ __html: header.title }}></div>}
                {header?.desc && <div className="header-desc animation-appear-container" dangerouslySetInnerHTML={{ __html: header.desc }}></div>}
                {(header?.actions && header?.actions.length > 0) &&
                    <ButtonsWrapper
                        classes="animation-appear-container"
                    >
                        {header?.actions?.map((action, idx) => (
                            <Buttons
                                width='auto'
                                type={action.type}
                                icon={action.icon}
                                label={action.label}
                                callback={action.callback}
                            />
                        ))}

                    </ButtonsWrapper>
                }
            </div>
            <div className="usecase-sections">
                <div className="sections-content">
                    {UseCases?.map((usecase, idx) => (
                        <div
                            key={`usecase-item-${idx}`}
                            className="sections-content-item animation-appear-container"
                        >
                            {usecase.icon &&
                                <div className="content-item-icon"
                                    dangerouslySetInnerHTML={{ __html: usecase.icon }}
                                ></div>
                            }
                            <div className="content-item-details">
                                <div className="content-item-title">{idx + 1}. {usecase.title}</div>
                                <div className="content-item-desc">{usecase.desc}</div>
                                {usecase.link &&
                                    <a
                                        className="content-item-button"
                                        href={usecase.link}
                                        target="_blank"
                                    >Learn more</a>
                                }
                            </div>
                        </div>
                    ))}
                </div>
                {banner &&
                    <div className="sections-banner animation-appear-container">
                        <img
                            src={banner}
                            alt="usecase-banner"
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default Index;