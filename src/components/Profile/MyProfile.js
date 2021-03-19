import { useState, useEffect } from 'react'
import ProfileDetailsInfo from "./ProfileDetailsInfo";
import ProfileDetailsEdit from "./ProfileDetailsEdit";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

/**
 * SHOWS THE ENTIRE PROFILE ANYWAY
 * ONLY ACCESS BY THE USER
 * PRIVATEROUTE IN ROUTING.
 */

function MyProfile() {

    const user = useSelector(state => state.user)
    const [editMode, setEditMode] = useState(false)
    const history = useHistory()

    const onMainClick = () => {
        history.push('/')
    }

    const onEditClick = () => {
        editMode ? setEditMode(false) : setEditMode(true)
    }

    const onDeleteClick = async () => {
        async function deleteUser() {
            await fetch(`http://localhost:8080/api/v1/users/delete/${user.id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    history.push("/")
                })
        }
        await deleteUser()
    }

    console.log(user)


    return (
        <div>
            <p>Status: {user.hidden.toString()}</p>
            {editMode ? <ProfileDetailsEdit user={user} /> : <ProfileDetailsInfo user={user}/> }
            <button type="button" onClick={onMainClick}>Main</button>
            <button type="button" onClick={onEditClick}>Edit</button>
            <button type="button" onClick={onDeleteClick}>DELETE!!!</button>
        </div>
    );
}

export default MyProfile;


