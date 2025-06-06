
import Images from '../../assets/Images'

import CountUp from 'react-countup';

/*Components*/
import PopupWrapper from '../Popup/Wrapper'

const Index = ({ props }) => {

    const { isMainLogo = false, isLabel, label = "Loading...", has_wrapper = true, percentage = '' } = props

    return (
        has_wrapper ?
            <PopupWrapper styles={{ zIndex: 1000 }}>
                <div className="loading-container">
                    {isMainLogo ?
                        <div className="loading-logo">
                            <img src={Images.Logo} />
                        </div>
                        : ''}
                    <div className="loading-spinner">
                        <svg className="loading-spinner-circle" height="70" width="70">
                            <circle cx="35" cy="35" r="25"></circle>
                        </svg>
                    </div>
                    {isLabel ? <div className="loading-label">{label || "Loading..."}</div> : null}
                </div>
            </PopupWrapper>
            :
            <div className="loading-container">
                {isMainLogo ?
                    <div className="loading-logo">
                        <img src={Images.Logo} />
                    </div>
                    : ''}
                <div className="loading-spinner">
                    <svg className="loading-spinner-circle" height="70" width="70">
                        <circle cx="35" cy="35" r="25"></circle>
                        {percentage &&
                            <text x="35" y="40" textAnchor="middle" fontSize="16" fill="#333" fontFamily="sans-serif">
                                {percentage}
                            </text>
                        }
                    </svg>
                </div>
                {isLabel ? <div className="loading-label">{label || "Loading..."}</div> : null}
            </div>
    )

}

export default Index;