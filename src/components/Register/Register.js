import { useHistory } from "react-router-dom"
import { useState } from "react";
import {useDispatch} from "react-redux";
import {logIn} from "../../redux/actions";
import { Button, Form, Card } from 'react-bootstrap';
import styles from "./Register.module.css"
import { usernameInUse, emailInUse } from "./RegisterAPI";


function Register() {

    const history = useHistory()
    const [ username, setUsername ] = useState('')
    const [ name, setName ] = useState('')
    const [ secret, setSecret] = useState('')
    const [ email, setEmail] = useState('')
    const [ bio, setBio ] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')
    const maxStringLengthGeneral = 50;
    const maxStringLengthEmail = 350;
    const maxStringLengthBio = 1000;

    // RFC 5322
    const emailRegex = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"' +
        '(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")' +
        '@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\' +
        '[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?' +
        '|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])'

    const onUserNameInputChange = e => {
        setUsername(e.target.value)
    }

    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onSecretInputChange = e => {
        setSecret(e.target.value)
    }

    const onEmailInputChange = e => {
        setEmail(e.target.value)
    }

    const onBioInputChange = e => {
        setBio(e.target.value)
    }


    const checkInputFields = async () => {
        if (username === ''){
            return 'Skriv inn brukernavn.'
        } else if (name === ''){
            return 'Skriv inn navn'
        } else if (email === ''){
            return 'Skriv inn epostadresse'
        } else if (secret === ''){
            return 'Skriv inn et passord'
        } else if (bio === ''){
            return 'Skriv inn en biografi'
        } else if (!email.match(emailRegex)){
            return 'Epostadressen er ikke gyldig'
        } else if (username.length > maxStringLengthGeneral){
            return 'Maks ' + {maxStringLengthGeneral} + ' tegn i brukernavn.'
        } else if (email.length > maxStringLengthEmail){
            return 'Maks ' + {maxStringLengthEmail} + ' tegn i mail adresse.'
        } else if (secret.length > maxStringLengthGeneral){
            return 'Maks ' + {maxStringLengthGeneral} + ' tegn i passord.'
        } else if (bio.length > maxStringLengthBio){
            return 'Maks ' + {maxStringLengthBio} + ' tegn i biografi.'
        } else if (await emailInUse(email) === true){
            return 'Det finnes allerede en bruker med angitt epostadresse. Bruk en annen epsotadresse om du ønsker å registrere en ny bruker.'
        } else if (await usernameInUse(username) === true){
            return 'Brukernavnet er allerede i bruk. Registrer ny bruker med et annet brukernavn.'
        } else {
            return ''
        }
    }

    const onCancelClick = () =>{
        history.push("/login");
    }

    const onButtonClick = async () => {
        const message = await checkInputFields()

        if (message === ''){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, name:name, bio:bio, secret: secret, email:email,  hidden: false})
            };

            fetch('http://localhost:8080/api/v1/public/register', requestOptions)
                .then(r => r.json())
                .then( (registeredUser) => {
                    console.log(registeredUser)
                    history.push('/login')
                } );
        } else{
            setErrorMessage(message)
        }
    }

    return (
        <div className={styles.register}>
            <Card className="text-center">
                <Card.Header><h1>Registrer ny bruker</h1></Card.Header>
                <Card.Body>
                    <Form style={{textAlign: "left"}}>
                        <Form.Group controlId="username">
                            <Form.Label>Brukernavn</Form.Label>
                            <Form.Control type="text" placeholder="Skriv inn et unikt brukernavn" onChange={onUserNameInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="name">
                            <Form.Label>Fullt navn</Form.Label>
                            <Form.Control type="text" placeholder="Skriv inn fullt navn" onChange={onNameInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Epostaddresse</Form.Label>
                            <Form.Control type="text" placeholder="Skriv inn epostadresse" onChange={onEmailInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Passord</Form.Label>
                            <Form.Control type="password" placeholder="Skriv inn et sikkert passord" onChange={onSecretInputChange}/>
                        </Form.Group>
                        <Form.Group controlId="bio">
                            <Form.Label>Biografi</Form.Label>
                            <Form.Control as="textarea" rows={3} type="text" placeholder="Skriv inn en kort biografi." onChange={onBioInputChange}/>
                            <Form.Text className="text-muted">
                                {bio.length} / 1000
                            </Form.Text>
                        </Form.Group>
                        <p style={{color: "red"}}>{errorMessage}</p>
                        <Button type="button" onClick={onButtonClick}>Registrer ny bruker</Button>
                        <Button type="button" style={{float: "right", width: "10em"}} onClick={onCancelClick}>Avbryt</Button>
                    </Form>
                </Card.Body>
                <Card.Footer></Card.Footer>
            </Card>
        </div>
    );
}


export default Register;
