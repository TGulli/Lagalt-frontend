import {LOG_IN, LOG_OUT, UPDATE_USER, LOADING} from "./actionTypes"
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {useDispatch, useSelector} from "react-redux";
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

export function updateUser(userId, token) {
    return async function(dispatch) {
        console.log("token")
        console.log(token)
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
                    console.log("data")
                    console.log(data)
                    dispatch({
                        type: UPDATE_USER,
                        payload:
                            {data, token}
                })})
    }}
