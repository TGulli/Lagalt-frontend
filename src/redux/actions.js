import {LOG_IN, LOG_OUT, UPDATE_USER, LOADING} from "./actionTypes"

import {useDispatch, useSelector} from "react-redux";

/**
 * A redux-action that takes in a user and a token and
 * sets the global states user and token accordingly, and
 * sets the global state isLoggedIn to true.
 */
export const logIn = (user, token) => ({
    type: LOG_IN,
    payload: {
        user,
        token,
        isLoggedIn: true
    }
});


/**
 * A redux-action that sets the global states user and token
 * to empty values. And the global state isLoggedIn to false.
 */
export const logOut = () => ({
    type: LOG_OUT,
    payload: {
        isLoggedIn: false
    }
});


/**
 * A redux-action that takes in a user id and a token, and fetches
 * the user with that id from the server. We then set the global
 * state user to the user fetched from the server.
 */
export function updateUser(userId, token) {
    return async function(dispatch) {
        dispatch({
            type: LOADING,
            payload: token
        });
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token.token}
        }
        await fetch(`https://lagalt-service.herokuapp.com/api/v1/users/${userId}`, requestOptions )
            .then(response => response.json())
                .then(data => {
                    dispatch({
                        type: UPDATE_USER,
                        payload:
                            {data, token}
                    })
                })
    }}
