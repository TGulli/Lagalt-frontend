import {useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logIn} from "../../redux/actions";


function Login() {

    const [email, setEmail] = useState('')
    const [secret, setSecret] = useState('')
    const history = useHistory();


    const onEmailInputChange = e => {
        setEmail(e.target.value)
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
            body: JSON.stringify({email: email, secret: secret})
        };

        fetch('http://localhost:8080/api/v1/users/name', requestOptions)
            .then(r => r.json())
            .then((retrievedUser) => {
                if (retrievedUser.email === email && retrievedUser.secret === secret) { //TODO Backend stuff
                    dispatch(logIn(retrievedUser))
                    history.push('/')
                } else{
                    alert("No user found!") //TODO Exception
                }
            });

    }


    return (
        <div className="App">
            <h1>LOGIN</h1>
            <form>
                <fieldset>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="text" onChange={onEmailInputChange}/>
                </fieldset>

                <fieldset>
                    <label htmlFor="secret">Secret</label>
                    <input id="secret" type="password" onChange={onSecretInputChange}/>
                </fieldset>
                <button type="button" onClick={onButtonClick}>Login</button>
                <button type="button" onClick={onRegisterButtonClick}>Register</button>
            </form>
        </div>
    );
}


export default Login;
