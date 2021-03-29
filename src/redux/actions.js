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


/*export const updateUser = userId => (
    {
    type: UPDATE_USER,
    payload:{

        isLoggedIn: true
    }
})*/

/*export const updateUser = createAsyncThunk(UPDATE_USER, async(userId, thunkAPI) => {
    console.log("USERID IN ACTION: " + userId)
    const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`)
        .then(response => {
            console.log(response)
            return response})
})*/



export function updateUser(userId, token) {
    return function(dispatch) {
        /*dispatch({
            type: LOADING,
        });*/
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token.token}
        }
        fetch(`http://localhost:8080/api/v1/users/${userId}`, requestOptions )
            .then(response => {console.log(response.json()) && response.json()})
            .then(data =>
                dispatch({
                type: UPDATE_USER,
                payload:
                data
            }))
            /*.catch(error => dispatch({
                    type: UPDATE_USER,
                    payload: error
                })
            );*/
    }}
    /*return async (dispatch, getState) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`)
            dispatch({type: 'UPDATE_USER', payload: response})
        }catch(err){
            console.log(err)
        }
}}*/
