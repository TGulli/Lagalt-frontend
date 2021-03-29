import { useState, useEffect } from 'react'
import {useParams} from "react-router-dom";

import ProfileDetailsInfo from "./ProfileDetailsInfo";
import {useSelector} from "react-redux";

function UserProfile() {

    const [userState, setUserState] = useState('')
    const [loadedUser, setLoadedUser] = useState(false);
    const loginState = useSelector(state => state.isLoggedIn);
    const token = useSelector(state => state.token);
    let { id } = useParams();

    //public!

    useEffect( () => {
        async function fetchData() {

            const requestOptions = loginState? {method: 'GET', headers: {'Authorization': ('Bearer ' + token.token)}} : {method: 'GET'}
            const url = loginState ? `http://localhost:8080/api/v1/users/${id}` : `http://localhost:8080/api/v1/public/users/${id}`;

            await fetch(url, requestOptions)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setUserState(jsonResponse);
                    setLoadedUser(true)
                })
        }
        fetchData();

    }, [id]);


    return (
        <div>
        { loadedUser && <ProfileDetailsInfo user={userState} loginState={loginState}/>}
        </div>
    );
}

export default UserProfile;


