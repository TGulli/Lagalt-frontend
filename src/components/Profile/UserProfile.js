import { useState, useEffect } from 'react'
import {useParams} from "react-router-dom";

import ProfileDetailsInfo from "./ProfileDetailsInfo";

function UserProfile() {

    const [userState, setUserState] = useState('')
    let { id } = useParams();

    useEffect( () => {
        async function fetchData() {
            await fetch(`http://localhost:8080/api/v1/users/${id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setUserState(jsonResponse);
                })
        }
        fetchData();
    }, [id]);


    return (
        <ProfileDetailsInfo user={userState}/>
    );
}

export default UserProfile;


