import React, { useEffect, useState } from "react";

/*Assets */
import Images from '../../assets/Images'
import Icons from '../../assets/Icons'


const Index = ({
    title = "",
    desc = "",
    filters = [],
    items = [],
}) => {

    const [ActiveFilter, setActiveFilter] = useState(filters[0] || null)


    const handleFilter = (item) => {
        setActiveFilter(item)
    }


    return (
        <div className="blogref-wrapper-main">
            <div className="blogref-wrapper-header">
                <div className="header-title animation-appear-container">{title}</div>
                <div className="header-desc animation-appear-container">{desc}</div>
            </div>
            <div className="blogref-wrapper-filters animation-appear-container">
                <div className="filters-items">
                    {filters?.map((item, idx) => (
                        <div
                            key={`blogref-filter-item-${item}`}
                            className={`filters-item ${ActiveFilter == item && 'filters-item-active'}`}
                            onClick={() => handleFilter(item)}
                        >{item}</div>
                    ))}

                </div>
            </div>
            <div className="blogref-wrapper-content">
                <div className="content-items">
                    {items?.filter(c => ActiveFilter ? c.category == ActiveFilter : true)?.map((item, idx) => (
                        <a
                            key={`blogref-blog-${item.category}-${item.id}-${idx}`}
                            className="content-item animation-appear-container"
                            href={item.url || '#'}
                        >
                            <div className="item-banner">
                                <img src={item.banner} alt="" />
                            </div>
                            <div className="item-details">
                                <div className="item-details-title">{item.title}</div>
                                <div className="item-details-tags">
                                    {item?.tags.map((tag, idx) => (
                                        <div
                                            key={`blogref-tag-item-${tag}-${idx}`}
                                            className="item-details-tag"
                                        >#{tag}</div>
                                    ))}
                                </div>
                                <a
                                    href={item.link}
                                    target="_blank"
                                    className="item-details-button"
                                >
                                    <div className="label">Read now</div>
                                    <div className="icon"
                                        dangerouslySetInnerHTML={{ __html: Icons.default.right_arrow }}
                                    ></div>
                                </a>
                            </div>
                        </a>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Index;