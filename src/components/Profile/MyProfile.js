//import { useState, useEffect } from 'react'
import ProfileDetails from "./ProfileDetails";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

/**
 * SHOWS THE ENTIRE PROFILE ANYWAY
 * ONLY ACCESS BY THE USER
 * PRIVATEROUTE IN ROUTING.
 */

function MyProfile() {

    const user = useSelector(state => state.user)
    const history = useHistory()


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
            <p>Status: {user.hidden.toString()}</p>
            <ProfileDetails user={user}/>
            <button type="button" onClick={deleteOnClick}>DELETE!!!</button>
        </div>
    );
}

export default MyProfile;


