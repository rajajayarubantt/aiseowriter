import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux'

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import PopupWrapper from "../../components/Popup/Wrapper";
import PopupContainer from "../../components/Popup/Container";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'

/*handler*/
import UsersHandler from '../../handlers/users/users'

const AddUser = ({ type = 'create', callback = () => { } }) => {

    const navigator = useNavigate()
    const usersHandler = new UsersHandler()

    const { id } = useParams()

    const TITLE = `${type == 'edit' ? 'Update' : type == 'create' ? 'Add new' : ''} User`

    const store = useSelector(state => state)

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [Form_Data, setForm_Data] = useState({
        name: null,
        email: null,

    })
    const [ReadOnlyData, setReadOnlyData] = useState({
        name: type == 'view',
        email: type == 'view',
    })
    const [RequiredData, setRequiredData] = useState({
        name: true,
        email: true,

    })
    const [InvalidData, setInvalidData] = useState({
        name: false,
        email: false,

    })

    const ValidateForm = (formdata, validoption) => {

        let invaliddata = {}

        for (const datakey in formdata) {

            if (
                validoption[datakey] &&
                (
                    formdata[datakey] == ""
                    || formdata[datakey] == null
                )
            ) invaliddata[datakey] = true
        }

        setInvalidData({ ...InvalidData, ...invaliddata })

        return invaliddata

    }

    const handleClose = () => {

        if (callback) callback()
        return navigator(-1)
    }
    const handleSave = async (e) => {
        // e.preventDefault()

        let payload = { ...Form_Data }

        let invalidfields = ValidateForm(payload, RequiredData)

        if (Object.keys(invalidfields).length) {
            setWarningAlert(true)
            setWarningAlertType('warning')
            setwarningAlertMessage('Please fill all fields!')

            return
        }

        setIsLoading(true)

        let response = {
            success: false,
            message: 'Request failed, Please try again!'
        }

        if (type == 'create') response = await usersHandler.create(payload)
        else if (type == 'edit') response = await usersHandler.update({ id, ...payload })

        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        return handleClose()
    }

    const ACTIONS = [
        {
            id: 'cancel',
            type: 'default',
            width: 'sm',
            label: 'Discard',
            callback: handleClose
        },
        {
            id: 'save',
            type: 'primary',
            width: 'sm',
            label: 'Save',
            callback: handleSave
        }
    ]

    const handleInputChange = (key, value) => {
        setForm_Data({ ...Form_Data, [key]: value })
    }

    const getUser = async (filters = {}) => {

        filters = {
            ...filters,
        }

        setIsLoading(true)
        let response = await usersHandler.get(filters)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        if (!Array.isArray(response.data) || !response.data.length) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage('Failed to get user, Please try to re-open!')
        }

        let user_data = response.data[0]

        setForm_Data({
            name: user_data.name,
            email: user_data.email,
        })


    }

    useEffect(() => {
        if (type != 'create' && !id) navigator(-1)
        if (type != 'create' && id) getUser({ id })
    }, [])
    useEffect(() => {

        if (store.user.subscription.limitations && store.user.subscription.limitations.users <= 0) {
            return navigator(-1)
        }

    }, [store.user.subscription])

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
            <PopupWrapper>
                <PopupContainer
                    title={TITLE}
                    close_callback={handleClose}
                    actions={type != 'view' ? ACTIONS : []}
                    _style={{
                        width: 'var(--popup-width-md)',
                        height: 'var(--popup-height-auto)'
                    }}
                >
                    <InputWrapper>
                        <Inputs
                            id="add-user-name"
                            type="text"
                            width='max'
                            input_props={{
                                type: "text",
                                placeholder: `Enter user's name`,
                                readonly: ReadOnlyData.name,
                                value: Form_Data.name,
                                onChange: (val) => handleInputChange('name', val),
                                required: RequiredData.name,
                                label: "Name",
                                icon: Icons.default.user,
                                invalid: InvalidData.name,
                            }}
                        />
                        <Inputs
                            id="add-user-email"
                            type="text"
                            width='max'
                            input_props={{
                                type: "email",
                                placeholder: `Enter user's email`,
                                readonly: ReadOnlyData.email,
                                value: Form_Data.email,
                                onChange: (val) => handleInputChange('email', val),
                                required: RequiredData.email,
                                label: "Email",
                                icon: Icons.default.email,
                                invalid: InvalidData.email,
                            }}
                        />


                    </InputWrapper>


                </PopupContainer>

            </PopupWrapper>

        </>
    )
}

export default AddUser;