import { useState } from 'react'
import {useSelector, useDispatch} from "react-redux";
import ProfileDetailsEdit from "./ProfileDetailsEdit";
import ProfileDetailsInfo from "./ProfileDetailsInfo";
import {useHistory} from "react-router-dom";
import TagList from "../shared/TagList";
import {logOut} from "../../redux/actions";
import {Container, Button, Row, Col, Card} from "react-bootstrap";
import styles from "./MyProfile.module.css"

/**
 * Shows the entire user profile even if
 * they are hidden from the public.
 * Only accesible by the user, because
 * of privaterouting in routing
 */

function MyProfile() {

    const user = useSelector(state => state.user)
    const loginState = useSelector(state => state.isLoggedIn)
    const token = useSelector(state => state.token)
    const [editMode, setEditMode] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const history = useHistory()
    const dispatch = useDispatch()


    /**
     * Called when the user clicks on the edit button. The function
     * sets editMode to false if it was true, and sets is to true if
     * it vas false.
     * */
    const onEditClick = () => {
        editMode ? setEditMode(false) : setEditMode(true)
    }

    /**
     * Function is called when the user clicks on the delete button.
     * Async function that sends a delete request to the server with
     * the id of the user as a path variable. If the request was successful
     * the user is logged out and redirected to the main page. If not
     * the error that occurred is shown to the user.
     * */
    const onDeleteClick = async () => {
        async function deleteUser() {
            const requestOptions = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)}
            }
            await fetch(`https://lagalt-service.herokuapp.com/api/v1/users/${user.id}`, requestOptions)
                .then(response => response.json())
                .then((jsonResponse) => {
                    if (!jsonResponse.message){
                        dispatch(logOut())
                        history.push("/")
                    } else {
                        setErrorMessage(jsonResponse.message)
                    }
                })
        }
        await deleteUser()
    }


    return (
        <Container>
                <div className={styles.editButton}>
                    <Button type="button" variant="secondary" onClick={onEditClick}>{editMode? "Tilbake til bruker" : "Endre bruker" }</Button>
                </div>
            {editMode ? <ProfileDetailsEdit user={user} /> : <ProfileDetailsInfo user={user} loginState={loginState}/> }
            {user.userTags &&
                <div className={styles.mySkills}>
                    <Card>
                        <Card.Header> Mine ferdigheter: </Card.Header>
                        <Card.Body><TagList tags={user.userTags}/></Card.Body>
                    </Card>
                </div>}
            <div className={styles.deleteButton}>
                <Button type="button" variant="secondary" onClick={onDeleteClick}>Slett bruker</Button>
            </div>
            <p style={{color: "red"}}>{errorMessage}</p>
        </Container>
    );
}
export default MyProfile;


