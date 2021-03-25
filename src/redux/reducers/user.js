import {LOG_IN, LOG_OUT} from "../actionTypes"

const initialState = {
    user: {},
    token: '',
    isLoggedIn: false
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
    switch (action.type) {
        case LOG_IN: {
            console.log("Got to login switch ")
            const {user, token, isLoggedIn} = action.payload;
            console.log("LigIn: User" + {...user} + "isLoggedIn: " + isLoggedIn)
            return {
                //...state,
                user: {
                    ...user
                },
                token: token,
                isLoggedIn: isLoggedIn
            };
        }
        case LOG_OUT: {
            const {isLoggedIn} = action.payload;
            return {
                //...state,
                user: {},
                token: '',
                isLoggedIn: isLoggedIn
            };
        }
        default:
            return state;
    }
}
