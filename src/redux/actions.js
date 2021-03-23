import {LOG_IN, LOG_OUT} from "./actionTypes"

export const logIn = (user, token) => ({
    type: LOG_IN,
    payload: {
        user,
        token,
        isLoggedIn: true
    }
});

//
export const logOut = () => ({
    type: LOG_OUT,
    payload: {
        isLoggedIn: false
    }
});
