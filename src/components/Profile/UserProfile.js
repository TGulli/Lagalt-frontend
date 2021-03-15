import { useState, useEffect } from 'react'
import {useParams} from "react-router-dom";

import ProfileDetails from "./ProfileDetails";

function UserProfile() {

    const [userState, setUserState] = useState('')
    let { id } = useParams();

    useEffect( () => {
        async function fetchData() {
            await fetch(`http://localhost:8080/api/v1/users/get/${id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setUserState(jsonResponse);
                })
        }
        fetchData();
    }, [id]);


    return (
        <ProfileDetails user={userState}/>
    );
}

export default UserProfile;


