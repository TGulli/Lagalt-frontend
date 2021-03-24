import { useState, useEffect } from 'react'
import ProfileDetailsInfo from "./ProfileDetailsInfo";
import ProfileDetailsEdit from "./ProfileDetailsEdit";
import {useSelector} from "react-redux";
import ProfileDetails from "./ProfileDetails";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import TagList from "../shared/TagList";
import {logOut} from "../../redux/actions";

/**
 * SHOWS THE ENTIRE PROFILE ANYWAY
 * ONLY ACCESS BY THE USER
 * PRIVATEROUTE IN ROUTING.
 */

function MyProfile() {

    const user = useSelector(state => state.user)
    const [editMode, setEditMode] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()

    console.log(user);
    const onMainClick = () => {
        history.push('/')
    }

    const onEditClick = () => {
        editMode ? setEditMode(false) : setEditMode(true)
    }

    const onDeleteClick = async () => {
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

    console.log(user)


    return (
        <div>
            <p>Status: {user.hidden.toString()}</p>
            {editMode ? <ProfileDetailsEdit user={user} /> : <ProfileDetailsInfo user={user}/> }
            {user.userTags && <TagList tags={user.userTags}/>}
            <button type="button" onClick={onMainClick}>Main</button>
            <button type="button" onClick={onEditClick}>Edit</button>
            <button type="button" onClick={onDeleteClick}>DELETE!!!</button>
        </div>
    );
}

export default MyProfile;


