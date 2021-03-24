import {GoogleLogin} from 'react-google-login'
import {checkToken} from './LoginAPI'
import {logIn} from "../../redux/actions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";

const clientId = "119104222557-up2cfjpdaijqfnchovd4t33blblu11nv.apps.googleusercontent.com"

function GLogin () {


    const dispatch = useDispatch()
    const history = useHistory();

    const onSuccess = (res) => {
        checkToken(res.getAuthResponse().id_token).then(jwtToken => {
            if (jwtToken != null) {
                dispatch(logIn(jwtToken.user, jwtToken.token))
                history.push("/")
            }
            else {
                alert('Token not authenticated')
            }
        });
    }

    const onFailedLogin = (res) => {
        console.log('Login failed, result:' + res)
    }

    return (
        <div>
            <GoogleLogin clientId={clientId}
                         buttonText="Login"
                         onSuccess={onSuccess}
                         onFailure={onFailedLogin}
                         cookiePolicy={'single_host_origin'}
            />
        </div>
    )

}

export default GLogin
