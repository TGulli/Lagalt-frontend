import {useHistory} from "react-router-dom";
import {useState} from "react";
import FacebookLogin from 'react-facebook-login';
import {logIn} from "../../../redux/actions";
import {useDispatch} from "react-redux";


function LoginFacebook() {

    const history = useHistory();

    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState('')

    const responseFacebook = (response) => {
        if (response.accessToken) {
            fetch('http://localhost:8080/api/v1/public/login/facebook/' + response.accessToken, {method: 'POST'})
                .then(r => r.json())
                .then(jwtToken => {
                    if (jwtToken) {
                        dispatch(logIn(jwtToken.user, jwtToken.token))
                        history.push("/")
                    }
                    else {
                        setErrorMessage(jwtToken.message)
                    }
                });
        }
    }

    return (
        <div>
            <FacebookLogin
                appId="261998892218369"
                fields="name,email,picture"
                scope="public_profile,user_friends,email"
                callback={responseFacebook}
                icon="fa-facebook"/>
                <p style={{color: "red"}}>{errorMessage}</p>
        </div>
    );
}


export default LoginFacebook;
