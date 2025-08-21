
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const NoDataFound = ({ label }) => {

    return (
        <div className="nodata-main">
            <div className="nodata-icon"
                dangerouslySetInnerHTML={{ __html: Icons.default.nodata }}
            ></div>
            <div className="nodata-label">{label || "No Data Found"}</div>
        </div>
    )

}

export default NoDataFound;