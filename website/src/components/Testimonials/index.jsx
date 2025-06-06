import React from "react";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'


const Index = ({ title = "", desc = "", items = {} }) => {

    return (
        <div className="testimonials-wrapper-main">
            <div className="testimonials-wrapper-header">
                <div className="header-title animation-appear-container">{title}</div>
                <div className="header-desc animation-appear-container">{desc}</div>
            </div>
            <div className="testimonials-wrapper-content animation-appear-container">
                <div className="content-items">
                    {items.full_item &&
                        <div className="content-item content-item-full">
                            <div className="item-icon"
                                dangerouslySetInnerHTML={{ __html: Icons.default.quote_left }}
                            ></div>
                            <div className="item-message" dangerouslySetInnerHTML={{ __html: items.full_item.message }}></div>
                            <div className="item-author">
                                <div className="author-profile">
                                    <img src={items.full_item.author_profile} alt="" />
                                </div>
                                <div className="author-details">
                                    <div className="details-name">{items.full_item.author_name}</div>
                                    <div className="details-role">{items.full_item.author_role}</div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="content-items-column-wrapper">
                        {items?.items?.map((item, idx) => (
                            <div
                                key={`testimonials-column-wrapper-item-${idx}`}
                                className="content-item"
                            >
                                <div className="item-icon"
                                    dangerouslySetInnerHTML={{ __html: Icons.default.quote_left }}
                                ></div>
                                <div className="item-message" dangerouslySetInnerHTML={{ __html: item.message }}></div>
                                <div className="item-author">
                                    <div className="author-profile">
                                        <img src={item.author_profile} alt="" />
                                    </div>
                                    <div className="author-details">
                                        <div className="details-name">{item.author_name}</div>
                                        <div className="details-role">{item.author_role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;