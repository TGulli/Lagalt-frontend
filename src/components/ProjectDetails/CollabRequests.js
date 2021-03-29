import {useSelector} from "react-redux";
import styles from './CollabRequests.module.css'
import {NavLink} from "react-router-dom";
import {Button, Overlay, OverlayTrigger, Popover, Tooltip} from "react-bootstrap";
import {useRef, useState} from "react";

function CollabRequests(props) {

    const owner = useSelector(state => state.user)
    const token = useSelector(state => state.token)

    const [show, setShow] = useState(false);
    const target = useRef(null);

    function getUserId(user) {
        return user.split("/").pop()
    }

    function getProjectId(project) {
        return project.split("/").pop()
    }


    const popover = (motivationalText) => (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Motivasjonstekst</Popover.Title>
            <Popover.Content>
                {motivationalText}
            </Popover.Content>
        </Popover>
    );


    const handleApproveDecline = (collaborator, status) => {

        console.log(collaborator)
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
            body: JSON.stringify({user: {id: owner.id}, projectCollaborators: {id: collaborator.id, status: status, motivation: collaborator.motivation, user: { id: collaborator.user }, project: {id: collaborator.project}}})
        };
        fetch(`http://localhost:8080/api/v1/project/collaborators/${collaborator.id}`, requestOptions).then(r => console.log(r));
        props.onReload(true)
        let index = props.pendingCollaborators.pendingCollaborators.indexOf(collaborator)
        props.pendingCollaborators.pendingCollaborators.splice(index, 1)
    }

    return (
        <div>
            <header className={styles.header}>
                <h4>Antall søknader: {props.pendingCollaborators.pendingCollaborators.length}</h4>
            </header>
            {props.pendingCollaborators.pendingCollaborators.map(collaborator => (
                <div key={collaborator.id} className={styles.requests}>
                    <div className={styles.collabInfo}>
                        <p className={styles.collabName}> Søkernavn: <NavLink to={"/userprofile/" + collaborator.id}>{collaborator.name}</NavLink></p>
                        <OverlayTrigger trigger="click" placement="right" overlay={popover('HEAIRHAEIURHUIEAHRIUAEHRIUAEHRIUEAHRIUEAHRIUEAhuirh aiurheaui ehaiur heauirh eaiurhiuea heahr earhueiah riaehriuae hiuaehri uaehiurheiau huihe iheaih riueahr uaehru haeuirh uiaehriuaeh aehreahraehh ahe hah ah hheheh he ')}>
                            <a className={styles.collabText}>Les motivasjonstekst</a>
                        </OverlayTrigger>
                    </div>

                    <div className={styles.collabDecide}>
                        <Button type="button" variant="success" onClick={() => handleApproveDecline(collaborator, 1)}>Godkjenn</Button>
                        <Button type="button" variant="outline-danger" onClick={() => handleApproveDecline(collaborator, 2)}>Avslå</Button>
                    </div>
                </div>))}
        </div>
    );
}

export default CollabRequests;
