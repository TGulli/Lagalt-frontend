import { useHistory } from "react-router-dom"
import { useState } from "react";
import {useDispatch} from "react-redux";
import {logIn} from "../../redux/actions";
import {LOG_IN} from "../../redux/actionTypes";


function Register() {

    const history = useHistory()
    const dispatch = useDispatch();
    const [ name, setName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ secret, setSecret] = useState('')


    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onEmailInputChange = e => {
        setEmail(e.target.value)
    }

    const onSecretInputChange = e => {
        setSecret(e.target.value)
    }

    const onButtonClick = () => {


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, secret: secret, email: email, hidden: false})
        };
        console.log("WHat??")

        fetch('http://localhost:8080/api/v1/users', requestOptions)
            .then((r) => {
                if (r.status === 200){
                    return r.json()
                } else{
                    alert("Could not register the user.")
                    return null;
                }
            })
            .then( (retrievedUser) => {
                if (retrievedUser !== null){
                    dispatch(logIn(retrievedUser))
                    history.push('/')
                }
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
                    <label htmlFor="email">Email</label>
                    <input id="email"  type="email" onChange={onEmailInputChange}/>
                </fieldset>

                <fieldset>
                    <label htmlFor="secret">Secret</label>
                    <input id="secret" type="password" onChange={onSecretInputChange}/>
                </fieldset>
                <button type="button" onClick={onButtonClick}>CLICK ME ONE MORE TIME</button>
            </form>
        </div>
    );
}


export default Register;
