import { useHistory } from "react-router-dom"
import { useState } from "react";
import {useDispatch} from "react-redux";
import {logIn} from "../../redux/actions";


function Register() {

    const history = useHistory()
    const dispatch = useDispatch();
    const [ name, setName ] = useState('')
    const [ secret, setSecret] = useState('')
    const [ email, setEmail] = useState('')


    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onSecretInputChange = e => {
        setSecret(e.target.value)
    }

    const onEmailInputChange = e => {
        setEmail(e.target.value)
    }

    const onButtonClick = () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, secret: secret, email:email,  hidden: false})
        };

        fetch('http://localhost:8080/api/v1/public/register', requestOptions)
            .then(r => r.json())
            .then( (registeredUser) => {
                console.log(registeredUser)
                history.push('/login')
            } );
    }





    return (
        <div>
            <h1>REGISTER</h1>
            <form>
                <fieldset>
                <label htmlFor="name">Name</label>
                <input id="name"  type="text" onChange={onNameInputChange}/>
                </fieldset>
                <fieldset>
                    <label htmlFor="secret">Password</label>
                    <input id="secret" type="password" onChange={onSecretInputChange}/>
                </fieldset>
                <fieldset>
                    <label htmlFor="secret">Email</label>
                    <input id="secret" type="text" onChange={onEmailInputChange}/>
                </fieldset>
                <button type="button" onClick={onButtonClick}>CLICK ME ONE MORE TIME</button>
            </form>
        </div>
    );
}


export default Register;
