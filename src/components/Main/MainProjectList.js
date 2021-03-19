import MainProjectListOwners from "./MainProjectListOwners";
import {useHistory} from "react-router-dom";
import styles from './MainProjectList.module.css'
import TagList from "../shared/TagList";
import MainProjectListBanner from "./MainProjectListBanner";

function MainProjectList({content, userState}) {
    const history = useHistory();

    const toProjectDetailsClick = param => e => { //TODO remove e?
        history.push('/projectdetails/' + param.toString())
    }



    return (
        <div>
            <h1>Projects!</h1>

            {content.map((project, index) => (
                <div key={index} className={styles.projectDisplay}>
                    <button type="button" value={project.id} onClick={toProjectDetailsClick(project.id)}>
                        <h4>Project name: {project.name}</h4>
                        <MainProjectListBanner project={project} user={userState} />
                    </button>
                    <p>Category: {project.category}</p>
                    <TagList tags={project.projectTags}/>
                    <p>Description: {project.description}</p>
                    <p>Status: {project.progress}</p>
                    <p>Image: {project.image}</p>
                    <MainProjectListOwners owners={project.owners}/>
                </div>
            ))}
        </div>
    );
}

export default MainProjectList;


