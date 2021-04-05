import {useHistory} from "react-router-dom";
import {useState} from "react";
import FacebookLogin from 'react-facebook-login';
import {logIn} from "../../../redux/actions";
import {useDispatch} from "react-redux";


function LoginFacebook() {

    //History for redirecting
    const history = useHistory();

    //Dispatch for setting global states
    const dispatch = useDispatch()

    //State for error message
    const [errorMessage, setErrorMessage] = useState('')


    /**
     * When the user tries to login with Facebook, a request for verifying the Facebook token is sent to the API.
     * If the login is successful the user and internal token is added to the global state and the user
     * is redirected to the main page.
     * If the the login fails, an error message is displayed.
     * */
    const responseFacebook = (response) => {
        if (response.accessToken) {
            fetch('https://lagalt-service.herokuapp.com/api/v1/public/login/facebook/' + response.accessToken, {method: 'POST'})
                .then(r => r.json())
                .then(jwtToken => {
                    if (!jwtToken.message) {
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
