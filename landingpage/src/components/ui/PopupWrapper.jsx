
const PopupWrapper = ({ children, styles = {}, }) => {

    return (
        <div className="popup-wrpper-main popup-wrapper-center" style={{ ...styles }}>
            <div className="popup-block-ui"></div>
            {children}
        </div>
    )

}

export default PopupWrapper;