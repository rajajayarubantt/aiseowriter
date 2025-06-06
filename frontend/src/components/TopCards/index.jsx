import { useEffect, useState } from 'react'

import CountUp from 'react-countup';
import { Flex, Skeleton } from 'antd';

/*Assets*/
import Icons from '../../assets/Icons'

const SmarkTopCards = ({ items = [], callback = () => { }, loading = false }) => {

    const [SmartCards, setSmartCards] = useState([])
    const [SmartCardsLoading, setSmartCardsLoading] = useState(false)

    const STYLES = {
        total: {
            color: '#0065ff',
            bg_linear_colors: {
                start: '#e5efff',
                end: '#e5f9ff'
            },
            border_color: '#c6d4dc',
        },
        inprogress: {
            color: '#fb993d',
            bg_linear_colors: {
                start: '#fff4ea',
                end: '#fffdf4'
            },
            border_color: '#dcd6cd',
        },
        completed: {
            color: '#33c87e',
            bg_linear_colors: {
                start: '#eaf9f2',
                end: '#f2fef7'
            },
            border_color: '#ccd8d2',
        },
        failed: {
            color: '#ff5b5b',
            bg_linear_colors: {
                start: '#ffeded',
                end: '#fff9f9'
            },
            border_color: '#dcd1d1',
        },
        published: {
            color: '#7e57c2',
            bg_linear_colors: {
                start: '#e8def7',
                end: '#ede7f6'
            },
            border_color: '#ccc7d4',
        }
    }



    const HandleSetup = () => {

        setSmartCardsLoading(true)
        setSmartCards(items)
        setSmartCardsLoading(false)
    }

    useEffect(() => {

        HandleSetup()
    }, [])

    return (
        <div className="smart-top-cards-main">
            <div className="smart-top-cards-items">
                {
                    SmartCards.map((item, index) => (

                        <div
                            className="smart-top-card"
                            key={item.id}
                            style={{
                                color: STYLES[item.type].color,
                                borderColor: STYLES[item.type].color,
                                // backgroundImage: `linear-gradient(to right, ${STYLES[item.type].bg_linear_colors.start}, ${STYLES[item.type].bg_linear_colors.end})`
                            }}
                            onClick={() => callback ? callback(item.id) : null}
                        >
                            {loading ?
                                <Flex gap={'middle'} vertical>
                                    <Skeleton.Node active={true} style={{ width: 50, height: 10 }} />
                                    <Skeleton.Input active={true} size={30} />
                                </Flex >
                                :
                                <>
                                    <div className="card-detials">
                                        <div className="card-label">{item.label}</div>
                                        <CountUp className="card-value" end={item.value} separator="," />
                                    </div>
                                    <div
                                        className="card-icon"
                                        style={{ fill: STYLES[item.type].color }}
                                        dangerouslySetInnerHTML={{ __html: item.icon || Icons.general.invoice_total }}
                                    ></div>
                                </>
                            }

                        </div>


                    ))
                }


            </div>

        </div>
    )

}

export default SmarkTopCards;