import {useState} from "react"
import {useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import styles from './CreateApplcation.module.css'

function CreateApplication() {
    // get state param
    const location = useLocation();
    const project = location.state.project;

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const history = useHistory();

    const [motivationalText, setMotivationalText] = useState('');


    const onMotivationalTextChange = e => {
        console.log(e.target.value)
        setMotivationalText(e.target.value)
    }

    const onApplicationSendClick = () => {
        //TODO: Input validation
        if (motivationalText !== '') {
            const userId = user.id;
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
                body: JSON.stringify({user: {id: userId}, project: {id: project.id}, status: 0, motivation: motivationalText})
            };
            fetch('http://localhost:8080/api/v1/project/collaborators', requestOptions).then(r => console.log(r));
        }
    }

    const onCancelClick = () => {
        history.push('/projectdetails/' + project.id.toString())
    }


    return (
        <div className="App">
            <h1>Application for project: {project.name} </h1>
            <form>
                <fieldset>
                    <h4>By clicking "Send application" the project owners of {project.name} will have access to your
                        following information:</h4>
                    <ul>
                        <li>Your skills and tags</li>
                        <li>Previous and current projects you collaborate in</li>
                        <li>Previous and current projects you own</li>
                        <li>Your motivational text</li>
                    </ul>
                </fieldset>
                <fieldset>
                    <p>Motivational text</p>
                    <textarea id="motivationalText" cols="40" rows="5" onChange={onMotivationalTextChange} className={styles.inputField}/>
                </fieldset>
                <button type="button" onClick={onApplicationSendClick}>Send application</button>
                <button type="button" onClick={onCancelClick}>Cancel</button>
            </form>
        </div>
    );
}

export default CreateApplication;
