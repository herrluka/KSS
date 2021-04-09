const initState = {
    token: null,
    role: null,
    userName: ""
};

const rootReducer = (state = initState, action) => {
    if (action.type === 'SET_AUTH_FIELDS') {
        return {
            ...state,
            token: 'Bearer ' + action.token,
            userName: action.userName,
            role: action.role
        }
    }
    return state;
};

export default rootReducer