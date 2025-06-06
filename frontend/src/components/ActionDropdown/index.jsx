
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

import { Popconfirm } from 'antd'

const Index = ({ id, parent, options }) => {


    return (
        <div
            className="actiondropdown-main"
            id={`actiondropdown-main-${id}`}
        >
            <div className="actiondropdown-button"
                dangerouslySetInnerHTML={{ __html: Icons.default.option_horz }}
            ></div>
            <div className="actiondropdown-dropdown">
                <div className="dropdown-items">
                    {options?.map((option, idx) => (
                        option.confirmation ?
                            <Popconfirm
                                title={option.confirmation_title}
                                description={option.confirmation_desc}
                                onConfirm={(e) => option.callback(e, parent)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <div
                                    key={`actiondropdown-${id}-${idx}`}
                                    className="dropdown-item"
                                >
                                    {option.icon &&
                                        <div
                                            className="dropdown-item-icon"
                                            dangerouslySetInnerHTML={{ __html: option.icon }}
                                        ></div>
                                    }
                                    <div className="dropdown-item-label">{option.label}</div>
                                </div>
                            </Popconfirm>
                            :
                            <div
                                key={`actiondropdown-${id}-${idx}`}
                                className="dropdown-item"
                                onClick={(e) => option.callback(e, parent)}
                            >
                                {option.icon &&
                                    <div
                                        className="dropdown-item-icon"
                                        dangerouslySetInnerHTML={{ __html: option.icon }}
                                    ></div>
                                }
                                <div className="dropdown-item-label">{option.label}</div>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default Index;