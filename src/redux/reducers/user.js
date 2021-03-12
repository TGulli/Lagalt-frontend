import {LOG_IN, LOG_OUT} from "../actionTypes"

const initialState = {
    user: {},
    isLoggedIn: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOG_IN: {
            console.log("Got to login switch ")
            const {user, isLoggedIn} = action.payload;
            console.log("LigIn: User" + {...user} + "isLoggedIn: " + isLoggedIn)
            return {
                //...state,
                user: {
                    ...user
                },
                isLoggedIn: isLoggedIn
            };
        }
        case LOG_OUT: {
            const {isLoggedIn} = action.payload;
            return {
                //...state,
                user: {},
                isLoggedIn: isLoggedIn
            };
        }
        default:
            return state;
    }
}
