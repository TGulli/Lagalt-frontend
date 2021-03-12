import { useState, useEffect } from 'react'
import ProfileDetails from "./ProfileDetails";

/**
 * SHOWS THE ENTIRE PROFILE ANYWAY
 * ONLY ACCESS BY THE USER
 * PRIVATEROUTE IN ROUTING.
 */

function MyProfile() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [userState, setUserState] = useState('')


    //Knapp for hiding -> HTTP PUT bool = true/false;


    // BRUK REDUX HER
    useEffect( () => {
        async function fetchData() {
            await fetch(`http://localhost:8080/api/v1/users/get/${user.id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setUserState(jsonResponse);
                })
        }
        fetchData();
    }, [user.id]);


    return (
        <div>
            <p>Status: {userState.hidden}</p>
            <ProfileDetails user={userState}/>
        </div>
    );
}

export default MyProfile;


