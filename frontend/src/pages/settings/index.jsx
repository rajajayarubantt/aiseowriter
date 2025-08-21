import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { Popconfirm } from 'antd';
/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import Buttons from "../../components/Buttons";
import ActionDropdown from "../../components/ActionDropdown";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Cards from '../../components/Cards'
import { PageContainer, PageHeader } from '../../components/Page'

/* Sub Pages */
import AddUser from "./AddUser";

/*Helpers*/
import Utils from "../../helpers/utils";
import dayjs from 'dayjs';

/*handler*/
import UsersHandler from '../../handlers/users/users'


const Index = () => {

    const PAGE_ID = "pilots"

    const navigator = useNavigate()
    const usersHandler = new UsersHandler()

    const PAGE_TITLE = "Settings"
    const PAGE_DESC = "Effortlessly manage your workspace, users, and personal account with seamless control and efficiency."

    const store = useSelector(state => state)

    const [HasNoLimit, setHasNoLimit] = useState(true)

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const [Workspace_EditMode, setWorkspace_EditMode] = useState(false)

    const [Workspace_FormData, setWorkspace_FormData] = useState({
        name: null,

    })

    const [Workspace_RequiredData, setWorkspace_RequiredData] = useState({
        name: true,
    })
    const [Workspace_InvalidData, setWorkspace_InvalidData] = useState({
        name: false,

    })

    const [TeamUsers, setTeamUsers] = useState([])

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

        setWorkspace_InvalidData({ ...Workspace_InvalidData, ...invaliddata })

        return invaliddata

    }

    const handleWorkSpaceInputChange = (key, value) => {
        setWorkspace_FormData({ ...Workspace_FormData, [key]: value })
    }

    const handleWorspaceEditmode = () => {
        setWorkspace_EditMode(true)
    }
    const handleWorspaceCancel = () => {
        setWorkspace_EditMode(false)
    }
    const handleWorspaceSave = (e) => {
        // e.preventDefault()
        let payload = { ...Workspace_FormData }
        let invalidfields = ValidateForm(payload, Workspace_RequiredData)

        if (Object.keys(invalidfields).length) {
            setWarningAlert(true)
            setWarningAlertType('warning')
            setwarningAlertMessage('Please fill all fields!')

            return
        }

        setWorkspace_EditMode(false)
    }

    const handleAddUser = (e) => {
        navigator('add-user')
    }
    const handleEditUser = (user) => {
        navigator(`edit-user/${user.id}`)
    }
    const handleDeleteUser = async (user) => {

        let payload = {
            id: String(user.id)
        }

        setIsLoading(true)
        let response = await usersHandler.delete(payload)
        setIsLoading(false)

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }

        setWarningAlert(true)
        setWarningAlertType('success')
        setwarningAlertMessage(response.message)

        getUser()

    }

    const [SettingsCards, setSettingsCards] = useState([
        {
            disable: true,
            id: 'change_password',
            type: 'card',
            title: 'Change Password',
            description: 'Click the button below to set a new password or reset your existing password. You will be redirected to the password reset page.',
            _style: {
                color: 'var(--active-color)',
            },

            card_style: {
                background: 'var(--transparent-active-color)',
                borderColor: 'var(--active-color)',
            },

            actions: [
                {
                    id: 'change_pass_btn',
                    type: 'primary',
                    width: 'auto',
                    _style: {
                        background: 'var(--active-color)',
                    },
                    label: "Change Password",
                    callback: () => { }
                },
            ]
        },
        {
            id: 'delete_account',
            type: 'card',
            title: 'Delete Account',
            description: 'Warning: This action cannot be undone. This will permanently delete your account and remove all associated data.',
            _style: {
                color: 'var(--danger-color)',
            },

            card_style: {
                background: 'var(--transparent-danger-color)',
                borderColor: 'var(--danger-color)',
            },

            actions: [
                {
                    id: 'change_pass_btn',
                    type: 'primary',
                    width: 'auto',
                    _style: {
                        background: 'var(--danger-color)',
                    },
                    label: "Delete Account",
                    callback: () => { }
                },
            ]
        }
    ])

    const getStatusStyle = ({ role_type, status }) => {
        if (status == '0') {
            return {
                style: 'warning',
                label: 'Pending',
            }
        }
        else if (status == '1' && role_type == 'user') {
            return {
                style: 'active',
                label: 'Active',
            }
        }
        else if (status == '1' && role_type == 'admin') {
            return {
                style: 'success',
                label: 'Active',
            }
        }
        else if (status == '2') {
            return {
                style: 'danger',
                label: 'In Active',
            }
        }
    }

    const render_card = ({ id, item, idx }) => {

        return (
            <>
                <div className="card-top-main">
                    <div className="card-details">
                        <div className="details-content">
                            <div
                                className="details-title"
                                style={{ ...(item._style || {}) }}
                            >
                                {item.title}
                            </div>
                            <div
                                className="details-desc"
                                style={{ ...(item._style || {}) }}
                            >
                                {item.description}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-bottom-main">
                    <div></div>
                    <div className="card-actions">
                        {item.actions?.length > 0 &&
                            item.actions?.map((action, idx) => (
                                <Buttons
                                    type={action.type}
                                    icon={action.icon}
                                    _style={action._style}
                                    width={action.width}
                                    label={action.label}
                                    callback={action.callback}
                                />
                            ))
                        }
                    </div>
                </div>
            </>
        )
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

        let users_data = response.data

        users_data = users_data.map(user => {

            let { style: status_style, label: status_label } = getStatusStyle(user)

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.role_type == 'admin',
                status: user.status,
                status_style,
                status_label
            }
        })

        setTeamUsers(users_data)

    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {

        if (store.user.subscription.limitations) setHasNoLimit(store.user.subscription.limitations.users <= 0)

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
            <Routes>
                <Route exact path={`/add-user`} element={<AddUser type="create" callback={getUser} />}></Route>
                <Route exact path={`/edit-user/:id`} element={<AddUser type="edit" callback={getUser} />}></Route>
            </Routes>

            <PageContainer id={PAGE_ID}>
                <PageHeader
                    id={PAGE_ID}
                    title={PAGE_TITLE}
                    desc={PAGE_DESC}
                />

                <Cards
                    id={PAGE_ID}
                    _style={{
                        gap: '30px',
                        justifyContent: 'center',
                    }}
                    card_style={{
                        maxWidth: 'var(--page-card-three-quarters-width)',
                        height: 'max-content',
                        minHeight: 'var(--page-card-mid-height)'
                    }}
                    cards={SettingsCards}
                    render_card={render_card}
                >

                    <div className="card-item"
                        style={{
                            display: 'none',
                            maxWidth: 'var(--page-card-three-quarters-width)',
                            height: 'max-content',
                            minHeight: 'var(--page-card-mid-height)'
                        }}
                    >
                        <div className="card-header-main">
                            <div className="details-title">Workspace</div>
                        </div>
                        <div className="card-form-inputs">
                            <InputWrapper>
                                <Inputs
                                    id="form-workspace-name"
                                    type="text"
                                    width='max'
                                    input_props={{
                                        type: "text",
                                        placeholder: 'Workspace name',
                                        readonly: !Workspace_EditMode,
                                        value: Workspace_FormData.name,
                                        onChange: (val) => handleWorkSpaceInputChange('name', val),
                                        required: Workspace_RequiredData.name,
                                        label: "Workspace name",
                                        invalid: Workspace_InvalidData.name,
                                    }}
                                />
                            </InputWrapper>
                        </div>
                        <div className="card-bottom-main">
                            <div></div>
                            <div className="card-actions">
                                {!Workspace_EditMode ?
                                    <Buttons

                                        id='cancel'
                                        type='default'
                                        width='auto'
                                        label='Edit'
                                        icon={Icons.default.edit}
                                        callback={handleWorspaceEditmode}
                                    />
                                    :
                                    <>
                                        <Buttons

                                            id='cancel'
                                            type='default'
                                            width='auto'
                                            label='Cancel'
                                            callback={handleWorspaceCancel}
                                        />
                                        <Buttons

                                            id='save'
                                            type='primary'
                                            width='auto'
                                            label='Save'
                                            callback={handleWorspaceSave}
                                        />
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="card-item"
                        style={{
                            maxWidth: 'var(--page-card-three-quarters-width)',
                            height: 'max-content',
                            minHeight: 'var(--page-card-mid-height)'
                        }}
                    >
                        <div className="card-header-main">
                            <div className="details-title">Users</div>
                            <div className="details-desc">Add, edit, and manage user accounts</div>
                        </div>
                        <div className="card-form-items">
                            {TeamUsers?.map((item, idx) => (
                                <div
                                    key={`card-form-item-item-${item.id}`}
                                    className="card-form-item"
                                >
                                    <div className="form-item-details">
                                        <div className="form-item-title">{item.name}</div>
                                        <div className="form-item-desc">{item.email}</div>
                                    </div>
                                    <div className="form-item-actions">
                                        <div className="form-item-labels">
                                            <div className={`form-item-labels-item labels-item-${item.status_style}`}>{item.is_admin ? 'Admin' : item.status_label}</div>
                                        </div>
                                        {!item.is_admin &&
                                            <>
                                                <div className="icon-default"
                                                    dangerouslySetInnerHTML={{ __html: Icons.default.edit }}
                                                    onClick={() => handleEditUser(item)}
                                                ></div>
                                                <Popconfirm
                                                    title="Are you sure you want to delete?"
                                                    description=""
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={() => handleDeleteUser(item)}
                                                >
                                                    <div className="icon-default"
                                                        dangerouslySetInnerHTML={{ __html: Icons.default.delete }}
                                                    ></div>
                                                </Popconfirm>
                                            </>
                                        }
                                    </div>
                                </div>
                            ))}

                        </div>
                        <div className="card-bottom-main">
                            <div></div>
                            <div className="card-actions">
                                {HasNoLimit ?
                                    <Popconfirm
                                        title="Usage limitation"
                                        description="You have exhausted the the usage with your current plan period."
                                        okText="Upgrade"
                                        showCancel={false}
                                        onConfirm={() => navigator('/upgrade')}
                                    >
                                        <button
                                            type={'button'}
                                            className={`button button-primary elem-width-auto`}
                                        >
                                            <div
                                                dangerouslySetInnerHTML={{ __html: Icons.default.plus }}
                                                className="button-icon"
                                            ></div>
                                            <div className="button-label">Add Users</div>

                                        </button>
                                    </Popconfirm>
                                    :
                                    <Buttons

                                        id='save'
                                        type='primary'
                                        width='auto'
                                        label='Add Users'
                                        icon={Icons.default.plus}
                                        callback={handleAddUser}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                </Cards>
            </PageContainer>
        </>
    );
};

export default Index;
