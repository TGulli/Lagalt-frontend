import {GoogleLogout} from 'react-google-login'

const clientId = "119104222557-up2cfjpdaijqfnchovd4t33blblu11nv.apps.googleusercontent.com"

/**
 * Not in use
 */


function GLogout () {
    const onSuccess = (res) => {
        console.log('Logout successful!')
    }

    return (
        <div>
            <GoogleLogout clientId={clientId}
                          buttonText="Logout"
                          onLogoutSuccess={onSuccess}
            />
        </div>
    )

}


export default GLogout
