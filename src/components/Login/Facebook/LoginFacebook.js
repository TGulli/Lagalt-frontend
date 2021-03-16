import {useHistory} from "react-router-dom";
import {useState} from "react";
import FacebookLogin from 'react-facebook-login';



function LoginFacebook() {

    const history = useHistory();

    const [login, setLogin] = useState(false)
    const [data, setData] = useState({})
    const [picture, setPicture] = useState('')

    const responseFacebook = (response) => {
        console.log(response);
        setData(response);
        setPicture(response.picture.data.url);
        if (response.accessToken) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }

    const logOut = () => {
        setLogin(false)
        setData({})
        setPicture('')
    }

    return (
        <div>
            <div>
                {!login &&
                <FacebookLogin
                    appId="261998892218369"
                    fields="name,email,picture"
                    scope="public_profile,user_friends,email"
                    callback={responseFacebook}
                    icon="fa-facebook"/>
                }
                {login &&
                <div>
                    <img src={picture} alt=""/>
                    <p>Name: {data.name}</p>
                    <p>Email: {data.email}</p>
                </div>
                }
            </div>
            <button onClick={logOut}>Log out</button>
        </div>
    );
}


export default LoginFacebook;
