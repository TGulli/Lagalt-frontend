import {useSelector} from "react-redux";
import styles from './CollabRequests.module.css'
import {Button, OverlayTrigger, Popover} from "react-bootstrap";
import {useState} from "react";

function CollabRequests(props) {

    //Global states
    const owner = useSelector(state => state.user)
    const token = useSelector(state => state.token)

    //State for error message
    const [errorMessage, setErrorMessage] = useState('');


    /**
     * Displays the motivational text from the applicant
     * */
    const popover = (motivationalText) => (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Motivasjonstekst</Popover.Title>
            <Popover.Content>
                {motivationalText}
            </Popover.Content>
        </Popover>
    );

    /**
     * Displays the information about the applicant.
     * */
    const popoverUser = (user) => (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Bruker: {user.username}</Popover.Title>
            <Popover.Content>
                <p>Navn: {user.name}</p>
                <p>Epost: {user.email}</p>
                <p>Plass :{user.locale}</p>
                <p>Bio: {user.bio}</p>
                <p>Medlem av: {user.collaborated.map(x => x)}</p>
                <p>Eier av: {user.owner.map(x => x)}</p>
                <p>Ferdigheter: {user.userTags.map(x => x.tag)}</p>
            </Popover.Content>
        </Popover>
    );

    /**
     * Function is called when the user clicks
     * approve or decline on an application and fetches a put to the API
     * updating the status of the application.
     * */
    const handleApproveDecline = (collaborator, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
            body: JSON.stringify({id: collaborator.id, status: status, motivation: collaborator.motivation, user: { id: collaborator.user.id }, project: {id: collaborator.project.id}})
        };
        fetch(`https://lagalt-service.herokuapp.com/api/v1/project/collaborators/${collaborator.id}`, requestOptions)
            .then(r => r.json())
            .then((jwtToken) => {
                if (jwtToken.message){
                    setErrorMessage(jwtToken.message)
                }
            });
        props.onReload(true)
        let index = props.pendingCollaborators.indexOf(collaborator)
        props.pendingCollaborators.splice(index, 1)
    }

    return (
        <div>
            <header className={styles.header}>
                <h5 className={styles.h5collabRequests}>Antall søknader: {props.pendingCollaborators.length}</h5>
            </header>
            {props.pendingCollaborators.map(collaborator => (
                <div key={collaborator.id} className={styles.requests}>
                    <div className={styles.collabInfo}>

                        <OverlayTrigger trigger="click" placement="top" overlay={popoverUser(collaborator.user)}>
                        <a className={styles.collabName}>Les om brukeren</a>
                        </OverlayTrigger>


                        <OverlayTrigger trigger="click" placement="right" overlay={popover(collaborator.motivation)}>
                        <a className={styles.collabText}>Les motivasjonstekst</a>
                        </OverlayTrigger>
                    </div>

                    <div className={styles.collabDecide}>
                        <Button type="button" variant="success" onClick={() => handleApproveDecline(collaborator, 1)}>Godkjenn</Button>
                        <Button type="button" variant="outline-danger" onClick={() => handleApproveDecline(collaborator, 2)}>Avslå</Button>
                    </div>
                </div>))}
                <p style={{color: "red"}}>{errorMessage}</p>
        </div>
    );
}

export default CollabRequests;
