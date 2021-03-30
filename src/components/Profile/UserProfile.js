import { useState, useEffect } from 'react'
import {useHistory, useParams} from "react-router-dom";

import ProfileDetailsInfo from "./ProfileDetailsInfo";
import {useSelector} from "react-redux";
import styles from "./UserProfile.module.css"
import {Card, Container} from "react-bootstrap";
import TagList from "../shared/TagList";

function UserProfile() {

    const [userState, setUserState] = useState('')
    const [loadedUser, setLoadedUser] = useState(false);
    const loginState = useSelector(state => state.isLoggedIn);
    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user)
    const history = useHistory();
    let { id } = useParams();

    //public!

    console.log("userprofile")
    console.log("Param id: " +id)
    console.log("State id: " + user.id)

    useEffect( () => {
        console.log("userprofile useeffect")
        console.log("Param id: " +id)
        console.log("State id: " + user.id)
        if(Number(id) === user.id){
            history.push("/myprofile")
        }
        async function fetchData() {

            const requestOptions = loginState? {method: 'GET', headers: {'Authorization': ('Bearer ' + token.token)}} : {method: 'GET'}
            const url = loginState ? `http://localhost:8080/api/v1/users/${id}` : `http://localhost:8080/api/v1/public/users/${id}`;

            await fetch(url, requestOptions)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setUserState(jsonResponse);
                    console.log('HALLO HER Æ E')
                    console.log(JSON.stringify(jsonResponse))
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


