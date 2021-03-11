import { useState } from "react";


(function () {
    fetch("http://localhost:8080/api/v1/users/").then(res => res.json()).then((x) => console.log(x))
})();



function Login() {

    const [ name, setName ] = useState('')
    const [ secret, setSecret] = useState('')
    const [ user, setUser] = useState('')


    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onSecretInputChange = e => {
        setSecret(e.target.value)
    }

    const onButtonClick = () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, secret: secret})
        };

        fetch('http://localhost:8080/api/v1/users/add/', requestOptions)
            .then(r => r.json())
            .then( (retrievedUser) => {
                setUser(retrievedUser.name);
            } );

    }





    return (
        <div className="App">
            <h1>LOGIN</h1>
            <p>{ user }</p>
            <form>
                <fieldset>
                    <label htmlFor="name">Name</label>
                    <input id="name"  type="text" onChange={onNameInputChange}/>
                </fieldset>

                <fieldset>
                    <label htmlFor="secret">Secret</label>
                    <input id="secret" type="text" onChange={onSecretInputChange}/>
                </fieldset>
                <button type="button" onClick={onButtonClick}>CLICK ME ONE MORE TIME</button>
            </form>
        </div>
    );
}


export default Login;
