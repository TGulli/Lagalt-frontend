import { useState, useEffect } from 'react'
import ProfileDetails from "./ProfileDetails";
import {useSelector} from "react-redux";

/**
 * SHOWS THE ENTIRE PROFILE ANYWAY
 * ONLY ACCESS BY THE USER
 * PRIVATEROUTE IN ROUTING.
 */

function MyProfile() {

    const user = useSelector(state => state.user)
    //const [userState, setUserState] = useState(user)


    //Knapp for hiding -> HTTP PUT bool = true/false;


    // BRUK REDUX HER
    /*useEffect( () => {
        async function fetchData() {
            await fetch(`http://localhost:8080/api/v1/users/get/${user.id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setUserState(jsonResponse);
                })
        }
        fetchData();
    }, [user.id]);*/


    return (
        <div>
            <p>Status: {user.hidden.toString()}</p>
            <ProfileDetails user={user}/>
        </div>
    );
}

export default MyProfile;


