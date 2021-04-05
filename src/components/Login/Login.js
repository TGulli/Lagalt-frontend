import {useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logIn} from "../../redux/actions";
import GLogin from "./GLogin";
import LoginFacebook from "./Facebook/LoginFacebook";
import {Button, Card, Form} from "react-bootstrap";
import styles from "./Login.module.css"


function Login() {
    //States
    const [username, setUsername] = useState('')
    const [secret, setSecret] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')

    //History for redirecting
    const history = useHistory();


    /**
     * Set the input value for username.
     * */
    const onUsernameInputChange = e => {
        setUsername(e.target.value)
    }

    /**
     * Set the input value for password.
     * */
    const onSecretInputChange = e => {
        setSecret(e.target.value)
    }

    /**
     * If the user clicks register new user, the user is redirected to the register page
     * */
    const onRegisterButtonClick = () => {
        history.push('/register')
    }

    const dispatch = useDispatch()

    /**
     * If the user cancels the login, the user is redirected to the main page.
     * */
    const onCancelClick = () =>{
        history.push("/");
    }

    /**
     * When the user clicks log in, a post request is sent to the API.
     * If the login is successful the user object and token is added to the global states
     * and the user is redirected to the main page.
     * If the login fails, an error message is displayed to the user.
     * */
    const onButtonClick = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: secret})
        };

        fetch('https://lagalt-service.herokuapp.com/api/v1/public/login/internal', requestOptions)
            .then(r => r.json())
            .then((jwtToken) => {

                console.log(jwtToken)

                if (jwtToken.user){
                    dispatch(logIn(jwtToken.user, jwtToken.token))
                    history.push("/")
                } else {
                    if(jwtToken.status === 401) {
                        if (jwtToken.message === "Bruker er blokkert."){
                            setErrorMessage(`Du er blokkert grunnet for mange feil innloggings-forsøk. \n  Prøv igjen om ett minutt. `)
                        }else{
                            setErrorMessage("Brukeren er ikke verifisert")
                        }
                    }
                    else {
                        setErrorMessage(jwtToken.message)
                    }
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
