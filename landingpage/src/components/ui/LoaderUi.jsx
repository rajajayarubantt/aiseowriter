
/*Components*/
import PopupWrapper from './PopupWrapper'

const LoaderUi = ({ props }) => {

    const { isLabel, label = "Loading..." } = props

    return (

        <PopupWrapper styles={{ zIndex: 1000 }}>
            <div className="loading-container">
                <div className="loading-spinner">
                    <svg className="loading-spinner-circle" height="70" width="70">
                        <circle cx="35" cy="35" r="25"></circle>
                    </svg>
                </div>
                {isLabel ? <div className="loading-label">{label || "Loading..."}</div> : null}
            </div>
        </PopupWrapper>
    )

}

export default LoaderUi;