import {useState} from "react"
import {useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import {Button, Card, Form} from "react-bootstrap";
import "./CreateApplication.css"


function CreateApplication() {

    const location = useLocation();
    const project = location.state.project;

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const history = useHistory();

    const [motivationalText, setMotivationalText] = useState('');
    const [errorMessage, setErrorMessage] = useState('')


    /*
    * Function that takes in user input from motivational text input field
    * and sets motivationalText to the input
    * */
    const onMotivationalTextChange = e => {
        setMotivationalText(e.target.value)
    }


    /*
   * Function is called when the send application button is clicked. The function
   * checks if the input is valid. If it is valid a post request is sent to the
   * server to add the project collaborator with a pending status. If the
   * request is successful the user is redirected to the project-details page.
   * If not an error message shows what went wrong.
   * */
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
            fetch('https://lagalt-service.herokuapp.com/api/v1/project/collaborators', requestOptions)
                .then(r => r.json())
                .then((jwtToken) =>{
                if (jwtToken.message){
                    setErrorMessage(jwtToken.message)
                }
            });
            history.push('/projectdetails/' + project.id.toString())
        }else{
            setErrorMessage("Motivasjonsteksten kan ikke være tom")
        }
    }


    /*
   * Function cancel button is clicked. It redirects the user to the project-
   * details page.
   * */
    const onCancelClick = () => {
        history.push('/projectdetails/' + project.id.toString())
    }


    return (
        <div className="createApplication">
            <Card>
                <Card.Header className="text-center">
                    <h3>
                        Opprett forespørsel om å bli deltager i prosjektet "{project.name}"
                    </h3>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <fieldset>
                            <p className="p-ca">
                                Ved å klikke "Send forespørsel" vil eieren av prosjektet "{project.name}" få tilgang til følgende opplysninger:
                            </p>
                            <ul className="ul-ca">
                                <li>Dine ferdigheter</li>
                                <li>Oversikt over prosjektene du har deltatt/ deltar i</li>
                                <li>Oversikt over prosjektene du eier</li>
                                <li>Din motivasjonstekst</li>
                            </ul>
                        </fieldset>
                        <br/>
                        <Form.Group controlId="motivationalText">
                            <Form.Label>Motivasjonstekst:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                type="text"
                                placeholder="Skriv inn motivasjonen din for å delta i prosjektet."
                                onChange={onMotivationalTextChange}/>
                            <Form.Text className="text-muted">
                                {motivationalText.length} / 1000
                            </Form.Text>
                        </Form.Group>
                        <Button className="btn-ca-send"
                                variant="success"
                                type="button"
                                onClick={onApplicationSendClick}>
                            Send forespørsel
                        </Button>
                        <Button className="btn-ca-cancel"
                                variant="danger"
                                type="button"
                                onClick={onCancelClick}>
                            Avbryt
                        </Button>
                        <p className="p-ca-error">{errorMessage}</p>
                    </Form>
                </Card.Body>
                <Card.Footer></Card.Footer>
            </Card>
        </div>
    );
}
export default CreateApplication;
