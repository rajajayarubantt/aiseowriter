

const MoreOptionsBtn = ({ label = '', has_icon = false, icon = null, callback = () => { } }) => {


    return (
        <div className="more-options-btn"
            onClick={() => callback()}
        >{label || 'more options'}</div>
    )
}

export default MoreOptionsBtn;