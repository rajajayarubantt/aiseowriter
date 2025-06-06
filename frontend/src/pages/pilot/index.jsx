import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import Inputs from "../../components/Inputs";
import Buttons from "../../components/Buttons";
import ActionDropdown from "../../components/ActionDropdown";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Cards from '../../components/Cards'
import { PageContainer, PageHeader } from '../../components/Page'

/* Sub Pages */
import AddCampaign from "./AddCampaign";

/*Helpers*/
import Utils from "../../helpers/utils";
import dayjs from 'dayjs';

/*handler*/
import SchedulesHandler from '../../handlers/schedules/schedules'

const Index = () => {

    const PAGE_ID = "pilots"

    const navigator = useNavigate()
    const schedulesHandler = new SchedulesHandler()

    const PAGE_TITLE = "Pilot campaigns"
    const PAGE_DESC = "Effortlessly automate blog posting with smart category selection, targeted keywords, and compelling descriptions."


    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [Campaigns, setCampaigns] = useState([])

    const [CardActions, setCardActions] = useState([
        {
            id: 'edit',
            label: 'Edit',
            icon: Icons.default.edit,
            callback: (e, parent) => handleCardActions('edit', parent, e)
        },
        {
            id: 'duplicate',
            label: 'Duplicate',
            icon: Icons.default.duplicate,
            callback: (e, parent) => handleCardActions('duplicate', parent, e)
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: Icons.default.delete,
            callback: (e, parent) => handleCardActions('delete', parent, e)
        },
    ])

    const handleCardActions = (action, parent, e) => {
        if (action == 'view') navigator(`view/${parent.id}`)
        else if (action == 'edit') navigator(`edit/${parent.id}`)
    }

    const handleAddNew = () => {
        navigator('add')
    }

    const render_card = ({ id, item, idx }) => {

        return (
            <>
                <div className="card-top-main">
                    <div className="card-details">
                        <div className="details-id">#{idx + 1}</div>
                        <div className="details-title">{item.name}</div>
                    </div>
                    <ActionDropdown
                        id={item.id}
                        parent={item}
                        options={CardActions}
                    />
                </div>
                <div className="card-bottom-main">
                    <div className="card-labels-item">{item.start} {item.end ? ` - ${item.end}` : ''} | {item.year}</div>
                    <div className="card-count">{item.postcount}</div>
                </div>
            </>
        )
    }

    const getSchedule = async (filters = {}) => {


        setIsLoading(true)
        let response = await schedulesHandler.get(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let schedule_datas = response.data || []

        schedule_datas = schedule_datas?.map(d => {

            d.start = Utils.formateDateLabel({ ms: d.start_date, hideYear: true })
            d.end = Utils.formateDateLabel({ ms: d.end_date, hideYear: true })
            d.year = Utils.formatDateTime(d.start_date, 'YYYY')

            return d
        })

        setCampaigns(schedule_datas)


    }
    useEffect(() => {
        getSchedule()
    }, [])

    return (
        <>
            {isLoading ?

                <Loaders
                    props={{
                        isLabel: true
                    }} />
                : null}
            {warningAlert ?

                <Toasters
                    props={{
                        type: warningAlertType,
                        message: warningAlertMessage,
                        callback: (confirmation) => setWarningAlert(false)
                    }} />
                : null}
            <Routes>
                <Route exact path={`/add`} element={<AddCampaign type="create" callback={getSchedule} />}></Route>
                <Route exact path={`/view/:id`} element={<AddCampaign type="view" />}></Route>
                <Route exact path={`/edit/:id`} element={<AddCampaign type="edit" callback={getSchedule} />}></Route>
            </Routes>

            <PageContainer id={PAGE_ID}>
                <PageHeader
                    id={PAGE_ID}
                    title={PAGE_TITLE}
                    desc={PAGE_DESC}
                    actions={[
                        {
                            type: "primary",
                            icon: Icons.default.plus,
                            width: "auto",
                            label: "New Campaign",
                            callback: handleAddNew,
                        }
                    ]}
                />

                <Cards
                    id={PAGE_ID}
                    card_style={{}}
                    cards={Campaigns}
                    render_card={render_card}
                />

            </PageContainer>
        </>
    );
};

export default Index;
