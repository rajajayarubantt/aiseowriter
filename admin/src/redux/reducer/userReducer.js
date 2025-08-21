

const initialState = {
    isAuthenticated: false,
    profile: {},

}


const Reducer = (state = initialState, action) => {

    let { type, payload } = action

    return {
        ...state,
        ...payload
    }

}

export default Reducer