import {useState} from "react";
import {useHistory} from "react-router-dom";




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


    const onButtonClick = () => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, secret: secret})
        };

        fetch('http://localhost:8080/api/v1/users/find/', requestOptions)
            .then(r => r.json())
            .then((retrievedUser) => {
                if (retrievedUser.name === name && retrievedUser.secret === secret) { //TODO Backend stuff
                    localStorage.setItem('user', JSON.stringify(retrievedUser)) //TODO
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
        </div>
    );
}


export default Login;
