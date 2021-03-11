import { useState } from 'react'
import {useHistory} from "react-router-dom";

function Profile() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [userState, setUserState] = useState('')
    const history = useHistory()

    fetch(`http://localhost:8080/api/v1/users/get/${user.id}`).then(res => res.json()).then((x) => setUserState(x))

    const mainClick = () => {
        history.push('/')
    }


    return (
        <div>
            <p>User id: {userState.id}</p>
            <p>User Name: {userState.name}</p>
            <p>User Secret: {userState.secret}</p>
            <button type="button" onClick={mainClick}>Main</button>
        </div>
    );
}

export default Profile;


