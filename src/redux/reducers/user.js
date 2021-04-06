import {LOG_IN, LOG_OUT, UPDATE_USER, LOADING} from "../actionTypes"
import {updateUser} from "../actions";

/**
 * Sets the initial state of the global states
 */
const initialState = {
    user: {},
    token: '',
    isLoggedIn: false
}


/**
 * Reducer function that takes a state and an action and
 * updates the globalState depending on which action
 * type that is sent in.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
    switch (action.type) {
        case LOG_IN: {
            const {user, token, isLoggedIn} = action.payload;
            return {
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
                user: {},
                token: '',
                isLoggedIn: isLoggedIn
            };
        }
        case UPDATE_USER: {
            const {data, token} = action.payload;
            return {
                user: {...data},
                isLoggedIn: true,
                token: token
            }
        }
        case LOADING:
            return {
                user: {},
                token: action.payload,
                isLoggedIn: true
            }
        default:
            return state;
    }
}


