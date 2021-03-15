import { useState, useEffect } from 'react'
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import ProjectDetailsInfo from "./ProjectDetailsInfo";
import ProjectDetailsEdit from "./ProjectDetailsEdit";

function ProjectDetails() {
    const [projectState, setProjectState] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [owner, setOwner] = useState(false);
    const user = useSelector(state => state.user)
    const history = useHistory()
    let { id } = useParams();

    useEffect( () => {
        async function fetchData() {
            await fetch(`http://localhost:8080/api/v1/projects/get/${id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setProjectState(jsonResponse);
                    for (let projectOwner of jsonResponse.owners){
                        if (projectOwner.id === user.id) setOwner(true);
                    }
                })
        }
        fetchData();
    }, [id]);



    const mainClick = () => {
        history.push('/')
    }

    const onEditClick = () => {
        editMode === true ? setEditMode(false): setEditMode(true);
    }


    return (
        <div>
            { owner && <button type="button" onClick={onEditClick}>Edit</button> }

            <button type="button" onClick={mainClick}>Main</button>

            {editMode ? <ProjectDetailsEdit project={projectState} /> : <ProjectDetailsInfo project={projectState} />}
        </div>
    );
}

export default ProjectDetails;


