import styles from './ProjectDetailsInfo.module.css'
import {Image} from "react-bootstrap";
import TagList from "../shared/TagList";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";


function ProjectDetailsInfo({project}) {

    //Global state
    const loginState = useSelector(state => state.isLoggedIn)




    return (
        <div className={styles.infoWrapper}>
            <h3 className={styles.h3Text}>
                {loginState ?project.name : project.partialProject.name}</h3>
            <div className={styles.banner}>
                <Image className={styles.picture}
                       src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Risengrynsgr%C3%B8t.jpg"
                       alt='project image'/>
                <div className={styles.headerInfo}>
                    <p>Status: {loginState ? project.progress : project.partialProject.progress}</p>
                    <p>Kategori: {loginState ? project.category : project.partialProject.category}</p>
                    {loginState ?
                    <p>Eier: {project.owner &&
                         <NavLink to={"/userprofile/" + project.owner.id} activeClassName="selected">{project.owner.name}</NavLink>}
                    </p> :
                        <p>Eier: {project.partialProject.owner_username}</p>
                    }
                </div>
            </div>
            <h5>Om prosjektet</h5>
            <div>
                <p>{loginState ? project.description : project.partialProject.description}</p>
            </div>
            {loginState &&
                <section>
                    <h5>Kvalifikasjoner</h5>
                    <div className={styles.tagsWrapper}>
                        {project.projectTags && <TagList tags={project.projectTags}/>}
                    </div>
                    <br/>
                    <h5>Medlemmer</h5>
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
                </section>
            }
            <br/>
            <br/>
        </div>
    );
}

export default ProjectDetailsInfo;


