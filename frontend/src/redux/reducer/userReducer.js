

const initialState = {
    isAuthenticated: false,
    builder: {},
    company: {},
    projects: [],
    settings: {
        terms_conditions: [],
        payment_schedules: [],
        field_settings: [],
        finance_settings: [],
    },
    roles_permissions: [],
    clients: [],
    vendors: [],
    employees: []
}


const Reducer = (state = initialState, action) => {

    let { type, payload } = action

    return {
        ...state,
        ...payload
    }

}

export default Reducer