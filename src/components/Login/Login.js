import {useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logIn} from "../../redux/actions";
import GLogin from "./GLogin";
import LoginFacebook from "./Facebook/LoginFacebook";
import {Button, Card, Form} from "react-bootstrap";
import "./Login.css"


function Login() {

    const [username, setUsername] = useState('')
    const [secret, setSecret] = useState('')
    const history = useHistory();
    const [ errorMessage, setErrorMessage ] = useState('')


    const onUsernameInputChange = e => {
        setUsername(e.target.value)
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
            body: JSON.stringify({username: username, password: secret})
        };

        fetch('http://localhost:8080/api/v1/public/login/internal', requestOptions)
            .then(r => r.json())
            .then((jwtToken) => {
                console.log('Response: ' + JSON.stringify(jwtToken))

                if (jwtToken.user){
                    dispatch(logIn(jwtToken.user, jwtToken.token))
                    history.push("/")
                } else {
                    setErrorMessage("Ugyldig brukernavn eller passord.")
                }

            });
    }

    return (
        <div className="login">
            <Card className="text-center">
                <Card.Header><h1>Logg inn</h1></Card.Header>
                <Card.Body>
                    <div className="externalButtons">
                        <GLogin/>
                        <br/><br/>
                        <LoginFacebook/>
                    </div>


                    <Form className="needs-validation">
                        <Form.Group controlId="username">
                            <Form.Label>Brukernavn</Form.Label>
                            <Form.Control type="text" placeholder="Skriv inn brukernavn" onChange={onUsernameInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="secret">
                            <Form.Label>Passord</Form.Label>
                            <Form.Control type="password" placeholder="Skriv inn passord" onChange={onSecretInputChange}/>
                        </Form.Group>
                        <p>{errorMessage}</p>
                        <Button className="internalButton" type="button" onClick={onButtonClick}>Logg inn</Button>
                        <Button className="rightButton internalButton" type="button" onClick={onRegisterButtonClick}>Registrer ny bruker</Button>
                    </Form>
                </Card.Body>
                <Card.Footer></Card.Footer>
            </Card>
        </div>
    );
}


export default Login;
