import React from 'react';

/*Assets*/
import Icons from '../../assets/Icons'
import Images from '../../assets/Images'

/*Components */
import { Empty } from 'antd';
import NoData from '../NoData';

/*Helpers */
import Utils from "../../helpers/utils";


const Index = ({ id = Utils.getUniqueId(), children, _style = {}, card_style = {}, cards = [], render_card = () => { } }) => {

    const handleCardClick = (e, item) => {

        let action_main = document.getElementById(`actiondropdown-main-${item.id}`)

        let path = e.nativeEvent.composedPath ? e.nativeEvent.composedPath() : [];

        if (action_main && path.includes(action_main)) return;

        if (item.callback) item.callback('view', item, e);
    }

    return (

        <div
            id={`page-card-main-${id}`}
            className="page-card-main"
        >
            {cards?.length > 0 ?
                <div
                    className="card-items"
                    style={{ ..._style }}
                >
                    {children}
                    {cards?.filter(c => !c.disable).map((item, idx) => (
                        <div
                            key={`page-${id}-card-item-${idx}`}
                            className="card-item"
                            onClick={(e) => handleCardClick(e, item)}
                            style={{ ...card_style, ...(item.card_style || {}) }}
                        >
                            {render_card({ id, item, idx })}
                        </div>
                    ))}

                </div>
                :
                <NoData />
            }
        </div>
    )

}

export default Index;