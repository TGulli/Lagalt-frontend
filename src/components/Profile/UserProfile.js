import { useState, useEffect } from 'react'
import {useHistory, useParams} from "react-router-dom";

import ProfileDetailsInfo from "./ProfileDetailsInfo";
import {useSelector} from "react-redux";
import styles from "./UserProfile.module.css"
import {Card, Container} from "react-bootstrap";
import TagList from "../shared/TagList";

function UserProfile() {

    const [userState, setUserState] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loadedUser, setLoadedUser] = useState(false);
    const loginState = useSelector(state => state.isLoggedIn);
    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user)
    const history = useHistory();
    let { id } = useParams();


    /**
     * Use effect that checks if the logged in user is the user who's
     * profile it is. If it is, the user is redirected to the myProfile page.
     * The use effect then fetches the user object from the server and sets the
     * userState to the response. The use effect is rendered everytime the
     * id variable changes.
     * */
    useEffect( () => {
        if(Number(id) === user.id){
            history.push("/myprofile")
        }
        async function fetchData() {
            const requestOptions = loginState? {method: 'GET', headers: {'Authorization': ('Bearer ' + token.token)}} : {method: 'GET'}
            const url = loginState ? `https://lagalt-service.herokuapp.com/api/v1/users/${id}` : `https://lagalt-service.herokuapp.com/api/v1/public/users/${id}`;

            await fetch(url, requestOptions)
                .then(response => response.json())
                .then((jsonResponse) => {
                    if(jsonResponse.status === 400){
                        return history.push("/")
                    }
                    setUserState(jsonResponse);
                    setLoadedUser(true)
                })
        }
        fetchData();
    }, [id]);


    return (
        <Container>
        <div>
        { loadedUser && <ProfileDetailsInfo user={userState} loginState={loginState}/>}
        {(!userState.hidden && userState.userTags) &&
            <div className={styles.userSkills}>
                <Card>
                    <Card.Header> Mine ferdigheter: </Card.Header>
                    <Card.Body><TagList tags={user.userTags}/></Card.Body>
                </Card>
            </div>
        }
        </div>
        </Container>

    );
}
export default UserProfile;


