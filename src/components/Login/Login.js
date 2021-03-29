import {useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logIn} from "../../redux/actions";
import GLogin from "./GLogin";
import LoginFacebook from "./Facebook/LoginFacebook";
import {Button, Card, Form} from "react-bootstrap";
import styles from "./Login.module.css"


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

    const onCancelClick = () =>{
        history.push("/");
    }

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
        <div className={styles.login}>
            <Card className="text-center">
                <Card.Header><h1>Logg inn</h1></Card.Header>
                <Card.Body>
                    <div className={styles.externalButtons}>
                        <GLogin/>
                        <br/><br/>
                        <LoginFacebook/>
                    </div>



                    <Form className="needs-validation" style={{textAlign: "left"}}>
                        <Form.Group controlId="username">
                            <Form.Label>Brukernavn</Form.Label>
                            <Form.Control type="text" placeholder="Skriv inn brukernavn" onChange={onUsernameInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="secret">
                            <Form.Label>Passord</Form.Label>
                            <Form.Control type="password" placeholder="Skriv inn passord" onChange={onSecretInputChange}/>
                        </Form.Group>
                        <p style={{color: "red"}}>{errorMessage}</p>
                    </Form>
                    <div className={styles.leftButton}><Button style={{width: "8em"}} type="button" onClick={onButtonClick}>Logg inn</Button></div>
                    <div className={styles.rightButton}><Button style={{width: "8em"}} type="button" onClick={onCancelClick}>Avbryt</Button></div>
                    <div className={styles.centerButton}><Button style={{width: "12em"}} type="button" onClick={onRegisterButtonClick}>Registrer ny bruker</Button></div>
                </Card.Body>
                <Card.Footer></Card.Footer>
            </Card>
        </div>
    );
}


export default Login;
