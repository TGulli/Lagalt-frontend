import { useState, useEffect } from 'react'
import ProfileDetails from "./ProfileDetails";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {logOut} from "../../redux/actions";

/**
 * SHOWS THE ENTIRE PROFILE ANYWAY
 * ONLY ACCESS BY THE USER
 * PRIVATEROUTE IN ROUTING.
 */

function MyProfile() {

    const user = useSelector(state => state.user)
    const history = useHistory()
    const dispatch = useDispatch()

    console.log(user);

    const deleteOnClick = async () => {
        async function deleteUser() {
            await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {method: 'DELETE'})
                .then(response => response.json())
                .then((jsonResponse) => {
                    history.push("/")
                    dispatch(logOut())
                })
        }
        await deleteUser()
    }

    return (
        <div>
            <ProfileDetails user={user}/>
            <button type="button" onClick={deleteOnClick}>DELETE!!!</button>
        </div>
    );
}

export default MyProfile;


