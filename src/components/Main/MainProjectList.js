import MainProjectListOwners from "./MainProjectListOwners";
import {useHistory} from "react-router-dom";
import styles from './MainProjectList.module.css'
import MainProjectListTags from "./MainProjectListTags";
import TagList from "../shared/TagList";

function MainProjectList({content}) {
    const history = useHistory();

    const toProjectDetailsClick = param => e => { //TODO remove e?
        history.push('/projectdetails/' + param.toString())
        console.log("Project param: " + param)
    }


    return (
        <div>
            <h1>Projects!</h1>

            {content.map((project, index) => (
                <div key={index} className={styles.projectDisplay}>
                    <button type="button" value={project.id} onClick={toProjectDetailsClick(project.id)}>
                        <h4>Project name: {project.name}</h4>
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


