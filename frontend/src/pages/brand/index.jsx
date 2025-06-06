import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import ActionDropdown from "../../components/ActionDropdown";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Cards from '../../components/Cards'
import { PageContainer, PageHeader } from '../../components/Page'

/* Sub Pages */
import AddBrand from "./AddBrand";

/*Helpers*/
import Utils from "../../helpers/utils";
import dayjs from 'dayjs';

/*handler*/
import BrandHandler from '../../handlers/brands/brands'

const Index = () => {

    const PAGE_ID = "pilots"

    const navigator = useNavigate()
    const brandHandler = new BrandHandler()

    const PAGE_TITLE = "All Brands"
    const PAGE_DESC = "Easily create and manage multiple brands with unique identities, tailored for seamless integration into your blog content."

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [Brands, setBrands] = useState([])

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
                        <div className="details-img">
                            <img src={item.logo_url} alt={item.id} />
                        </div>
                        <div className="details-content">
                            <div className="details-title">{item.name}</div>
                            <div className="details-desc">{item.description}</div>
                        </div>
                    </div>
                    <ActionDropdown
                        id={item.id}
                        parent={item}
                        options={CardActions}
                    />
                </div>
                <div className="card-bottom-main">
                    <div className="card-labels">
                        {item.industry && <div className="card-labels-item">{item.industry}</div>}
                        {item.category && <div className="card-labels-item">{item.category}</div>}
                    </div>
                </div>
            </>
        )
    }

    const getBrands = async (filters = {}) => {


        setIsLoading(true)
        let response = await brandHandler.get(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        let brand_datas = response.data || []

        brand_datas = brand_datas?.map(d => {

            d.logo_file = Utils.dataURLtoFile(`data:image/png;base64,${d.logo}`, d.name)
            d.logo_url = `data:image/png;base64,${d.logo}`
            d.callback = handleCardActions

            return d
        })


        setBrands(brand_datas)


    }
    useEffect(() => {
        getBrands()
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
                <Route exact path={`/add`} element={<AddBrand type="create" callback={getBrands} />}></Route>
                <Route exact path={`/view/:id`} element={<AddBrand type="view" />}></Route>
                <Route exact path={`/edit/:id`} element={<AddBrand type="edit" callback={getBrands} />}></Route>
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
                            label: "Create Brand",
                            callback: handleAddNew,
                        }
                    ]}
                />

                <Cards
                    id={PAGE_ID}
                    card_style={{
                        maxWidth: 'var(--page-card-full-width)',
                    }}
                    cards={Brands}
                    render_card={render_card}
                />

            </PageContainer>
        </>
    );
};

export default Index;
