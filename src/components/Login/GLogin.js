import {GoogleLogin} from 'react-google-login'
import {checkToken} from './LoginAPI'
import {logIn} from "../../redux/actions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {useState} from "react";

const clientId = "119104222557-up2cfjpdaijqfnchovd4t33blblu11nv.apps.googleusercontent.com"

function GLogin () {


    const dispatch = useDispatch()
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('')

    /**
     * If the Google token is verified and login successful,
     * the global states (user and internal token) is set and the user is taken to the main page.
     * */
    const onSuccess = (res) => {
        checkToken(res.getAuthResponse().id_token).then(jwtToken => {
            if (jwtToken) {
                dispatch(logIn(jwtToken.user, jwtToken.token))
                history.push("/")
            }
            else {
                setErrorMessage(jwtToken.message)
            }
        });
    }

    /**
     * If the google login fail, an error message is displayed to the user.
     * */
    const onFailedLogin = (res) => {
        if (JSON.stringify(res) !== '{"error":"popup_closed_by_user"}')
        setErrorMessage("Login feilet: " + JSON.stringify(res))
    }

    return (
        <div>
            <GoogleLogin clientId={clientId}
                         buttonText="Logg inn med Google bruker"
                         onSuccess={onSuccess}
                         onFailure={onFailedLogin}
                         cookiePolicy={'single_host_origin'}
            />
            <p style={{color: "red"}}>{errorMessage}</p>
        </div>

    )

}

export default GLogin
