import {useHistory} from "react-router-dom";
import {useState} from "react";
import FacebookLogin from 'react-facebook-login';
import {logIn} from "../../../redux/actions";
import {useDispatch} from "react-redux";



function LoginFacebook() {

    const history = useHistory();

    const dispatch = useDispatch()

    const responseFacebook = (response) => {
        console.log(response);

        if (response.accessToken) {

            fetch('http://localhost:8080/api/v1/users/' + response.accessToken, {method: 'POST'}) // Todo Use requestbody instead of pathvariable?
                .then(r => r.json())
                .then((retrievedUser) => {
                    if (retrievedUser.name === response.name && retrievedUser.secret === response.id) { //TODO Backend stuff
                        dispatch(logIn(retrievedUser))
                        history.push('/')
                    } else{
                        console.log(retrievedUser)
                        alert("No user found!") //TODO Exception
                    }
                });
        }
    }

    return (
        <div>
            <div>
                <FacebookLogin
                    appId="261998892218369"
                    fields="name,email,picture"
                    scope="public_profile,user_friends,email"
                    callback={responseFacebook}
                    icon="fa-facebook"/>
            </div>
        </div>
    );
}


export default LoginFacebook;
