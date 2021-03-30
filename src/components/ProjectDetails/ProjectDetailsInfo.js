import styles from './ProjectDetailsInfo.module.css'
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import MainProjectListOwners from "../Main/MainProjectListOwners";
import TagList from "../shared/TagList";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

function ProjectDetailsInfo({project}) {

    const loginState = useSelector(state => state.isLoggedIn)
    console.log(project.collaborators)
    console.log('PARTIALS: ' + project.partialProject)
    console.log('LoginState: ' + loginState)

    return (
        <div>
            <div className={styles.banner}>
                <Image className={styles.picture} src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Risengrynsgr%C3%B8t.jpg" alt=''/>
                <div className={styles.headerInfo}>
                    <p>Status: {loginState ? project.progress : project.partialProject.progress}</p>
                    {loginState &&
                    <p>Eier: {project.owners && project.owners.map((owner, index) => {
                        return <div key={index}> <p id="owner"><NavLink to={"/userprofile/" + owner.id} activeClassName="selected">{owner.name}</NavLink></p></div>})}</p>
                    }
                </div>
            </div>
            <div className={styles.details}>
                <h4>Beskrivelse</h4>
                <div>
                    <p>{loginState ? project.description : project.partialProject.description}</p>
                </div>
                <h4>Kvalifikasjoner</h4>
                <div className={styles.tagsWrapper}>
                    {project.projectTags && <TagList tags={project.projectTags}/>}
                </div>
                <br/>
                {loginState && <h4>Medlemmer</h4>}
                <div className={styles.collaboratorsWrapper}>
                    {(loginState && project.collaborators) && project.collaborators.map((collaborator, index) => {
                        return collaborator.status === 'APPROVED' && <div className={styles.collaborator} key={index}><p><NavLink to={"/userprofile/" + collaborator.user.id} activeClassName="selected">{collaborator.user.username}</NavLink></p></div>})}
                </div>
            </div>

            <br/>
            <br/>
        </div>
    );
}

export default ProjectDetailsInfo;


