import {useState} from "react"
import {useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import {Button, Card, Form} from "react-bootstrap";
import styles from './CreateApplication.module.css'


function CreateApplication() {
    // get state param
    const location = useLocation();
    const project = location.state.project;

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const history = useHistory();

    const [motivationalText, setMotivationalText] = useState('');
    const [errorMessage, setErrorMessage] = useState('')


    const onMotivationalTextChange = e => {
        console.log(e.target.value)
        setMotivationalText(e.target.value)
    }

    const onApplicationSendClick = () => {
        if (motivationalText.length > 1000){
            setErrorMessage("Maks 1000 tegn i motivasjonsteksten.")
        } else if (motivationalText !== '') {
            const userId = user.id;
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
                body: JSON.stringify({user: {id: userId}, project: {id: project.id}, status: 0, motivation: motivationalText})
            };
            fetch('http://localhost:8080/api/v1/project/collaborators', requestOptions).then(r => console.log(r));
            history.push('/projectdetails/' + project.id.toString())
        }
    }

    const onCancelClick = () => {
        history.push('/projectdetails/' + project.id.toString())
    }


    return (
        <div className={styles.createApplication}>
            <Card className="text-center">
                <Card.Header><h2>Forespørsel for å bli deltager av prosjektet "{project.name}"</h2></Card.Header>
                <Card.Body>
                    <Form>
                        <fieldset>
                            <p style={{fontSize: 18}}>Ved å klikke "Send forespørsel" vil prosjekteieren av prosjektet "{project.name}" ha tilgang til følgende opplysninger:</p>
                            <ul>
                                <li>Dine skills og tags</li>
                                <li>Tidligere og nåværende prosjekter du deltar i</li>
                                <li>Tidligere og nåværende prosjekter du eier</li>
                                <li>Din motivasjonstekst</li>
                            </ul>
                        </fieldset>
                        <br/><br/>
                        <Form.Group controlId="motivationalText">
                            <Form.Label>Motivasjons tekst:</Form.Label>
                            <Form.Control as="textarea" rows={5} type="text" placeholder="Skriv inn en motivasjon for å sende inn en forespørsel for å bli medlem av prosjektet." onChange={onMotivationalTextChange}/>
                            <Form.Text className="text-muted">
                                {motivationalText.length} / 1000
                            </Form.Text>
                        </Form.Group>
                        <Button type="button" style={{width: "10em"}} onClick={onApplicationSendClick}>Send forespørsel</Button>
                        <Button type="button" style={{float: "right", width: "10em"}} onClick={onCancelClick}>Avbryt</Button>
                        <p style={{color: "red"}}>{errorMessage}</p>
                    </Form>
                </Card.Body>
                <Card.Footer></Card.Footer>
            </Card>
        </div>
    );
}

export default CreateApplication;
