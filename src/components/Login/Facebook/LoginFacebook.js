import {useHistory} from "react-router-dom";
import {useState} from "react";
import FacebookLogin from 'react-facebook-login';
import {logIn} from "../../../redux/actions";
import {useDispatch} from "react-redux";


function LoginFacebook() {

    const history = useHistory();

    const dispatch = useDispatch()

    const responseFacebook = (response) => {
        if (response.accessToken) {
            fetch('http://localhost:8080/api/v1/public/login/facebook/' + response.accessToken, {method: 'POST'}) // Todo Use requestbody instead of pathvariable?
                .then(r => r.json())
                .then(jwtToken => {
                    if (jwtToken != null) {
                        dispatch(logIn(jwtToken.user, jwtToken.token))
                        history.push("/")
                    }
                    else {
                        alert('Token not authenticated')
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
