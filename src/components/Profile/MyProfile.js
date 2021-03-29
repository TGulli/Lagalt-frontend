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
 * SHOWS THE ENTIRE PROFILE ANYWAY
 * ONLY ACCESS BY THE USER
 * PRIVATEROUTE IN ROUTING.
 */

function MyProfile() {

    const user = useSelector(state => state.user)
    const loginState = useSelector(state => state.isLoggedIn)
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
            const requestOptions = {
                method: 'DELETE'}
            await fetch(`http://localhost:8080/api/v1/users/${user.id}`, requestOptions)
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
        <Container>
            <Button type="button" variant="outline-secondary" onClick={onMainClick}>Main</Button>

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
        </Container>
    );
}
export default MyProfile;


