import styles from './ProjectDetailsInfo.module.css'
import {Button, Col, Container, Row} from "react-bootstrap";
import MainProjectListOwners from "../Main/MainProjectListOwners";
import TagList from "../shared/TagList";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

function ProjectDetailsInfo({project}) {

    const loginState = useSelector(state => state.isLoggedIn)
    const [members, setMembers] = useState([{
        members: []
    }])
    console.log("project collaborators")
    console.log(project.collaborators)
    console.log('PARTIALS: ' + project.partialProject)
    console.log('LoginState: ' + loginState)


    /*useEffect( () => {
        async function getMembersName
    })

     */


    return (
        <div>
            <div className={styles.banner}>
                <Container fluid={true} style={{margin: 0}}>
                    <Row>
                        <Col xs lg={3} className={styles.image}>
                        </Col>
                        <Col xs lg={1}>
                            <h1>{loginState ? project.name : project.partialProject.name}</h1>
                            <p>Status: {loginState ? project.progress : project.partialProject.progress}</p>
                            {loginState &&
                            <p>Eier: {project.owners && project.owners.map((owner, index) => {
                                return <div key={index}> <p id="owner"><NavLink to={"/userprofile/" + owner.id} activeClassName="selected">{owner.name}</NavLink></p></div>})}</p>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
            <h4>Beskrivelse</h4>
            <div>
                <p>{loginState ? project.description : project.partialProject.description}</p>
            </div>
            <h4>Kvalifikasjoner</h4>
            <div className={styles.tagsWrapper}>
                {project.projectTags && <TagList tags={project.projectTags}/>}
            </div>
            <br/>
            {loginState &&
                <section>
                    {console.log("Kom inn i loginstate")}
                    <h4>Medlemmer</h4>
                    <div className={styles.collaboratorsWrapper}>
                        {project.collaborators && project.collaborators.map((collaborator, index) => {
                            return collaborator.status === 'APPROVED' &&
                                <div className={styles.collaborator} key={index}>
                                    <p>
                                        <NavLink to={"/userprofile/" + collaborator.user} activeClassName="selected">{collaborator.userName}
                                        </NavLink>
                                    </p>
                                </div>})
                        }
                    </div>
                </section>}
            <br/>
            <br/>
        </div>
    );
}

export default ProjectDetailsInfo;


