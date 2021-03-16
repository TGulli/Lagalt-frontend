import {GoogleLogin} from 'react-google-login'
import {checkToken} from './LoginAPI'

const clientId = "119104222557-up2cfjpdaijqfnchovd4t33blblu11nv.apps.googleusercontent.com"

function GLogin () {
    const onSuccess = (res) => {
        console.log('Login successful, profile:' +  res.profileObj)
        console.log(JSON.stringify(res.getAuthResponse().id_token, null, 4))
        checkToken(res.getAuthResponse().id_token).then(r => console.log(r));
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
                         isSignedIn={true}
            />
        </div>
    )

}


export default GLogin
