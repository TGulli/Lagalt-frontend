import {useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logIn} from "../../redux/actions";
import GLogin from "./GLogin";
import LoginFacebook from "./Facebook/LoginFacebook";

function Login() {

    const [name, setName] = useState('')
    const [secret, setSecret] = useState('')
    const history = useHistory();


    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onSecretInputChange = e => {
        setSecret(e.target.value)
    }

    const onRegisterButtonClick = () => {
        history.push('/register')
    }

    const dispatch = useDispatch()

    const onButtonClick = () => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: name, password: secret})
        };

        fetch('http://localhost:8080/api/v1/public/login/internal', requestOptions)
            .then(r => r.json())
            .then((jwtToken) => {
                console.log('Response: ' + JSON.stringify(jwtToken))
                dispatch(logIn(jwtToken.user, jwtToken.token))
                history.push("/")
            });
    }


    return (
        <div className="App">
            <h1>LOGIN</h1>
            <form>
                <fieldset>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" onChange={onNameInputChange}/>
                </fieldset>

                <fieldset>
                    <label htmlFor="secret">Secret</label>
                    <input id="secret" type="text" onChange={onSecretInputChange}/>
                </fieldset>
                <button type="button" onClick={onButtonClick}>Login</button>
                <button type="button" onClick={onRegisterButtonClick}>Register</button>
            </form>
            <div>
                <GLogin />
                <LoginFacebook/>
            </div>
        </div>
    );
}


export default Login;
