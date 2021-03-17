import { useState, useEffect } from 'react'
import ProfileDetails from "./ProfileDetails";
import {useHistory} from "react-router-dom";

/**
 * SHOWS THE ENTIRE PROFILE ANYWAY
 * ONLY ACCESS BY THE USER
 * PRIVATEROUTE IN ROUTING.
 */

function MyProfile() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [userState, setUserState] = useState('')
    const history = useHistory()


    //Knapp for hiding -> HTTP PUT bool = true/false;


    // BRUK REDUX HER
    useEffect( () => {
        async function fetchData() {
            await fetch(`http://localhost:8080/api/v1/users/${user.id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setUserState(jsonResponse);
                })
        }
        fetchData();
    }, [user.id]);

    const deleteOnClick = async () => {
        async function deleteUser() {
            await fetch(`http://localhost:8080/api/v1/users/delete/${user.id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    history.push("/")
                })
        }
        await deleteUser()
    }


    return (
        <div>
            <p>Status: {userState.hidden}</p>
            <ProfileDetails user={userState}/>
            <button type="button" onClick={deleteOnClick}>DELETE!!!</button>
        </div>
    );
}

export default MyProfile;


