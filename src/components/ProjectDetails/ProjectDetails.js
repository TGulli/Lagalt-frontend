import { useState, useEffect } from 'react'
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import ProjectDetailsInfo from "./ProjectDetailsInfo";
import ProjectDetailsEdit from "./ProjectDetailsEdit";

function ProjectDetails() {
    const user = useSelector(state => state.user);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const [projectState, setProjectState] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [owner, setOwner] = useState(false);
    const history = useHistory()
    let { id } = useParams();

    useEffect( () => {
        async function fetchData() {
            await fetch(`http://localhost:8080/api/v1/projects/${id}`)
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

    const applyClick = () => {
        const userId = user.id;
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user: { id: userId}, project: {id: id}, status: 0})
        };
        fetch('http://localhost:8080/api/v1/project/collaborators', requestOptions).then(r => console.log(r));
    }

    const onEditClick = () => {
        editMode === true ? setEditMode(false): setEditMode(true);
    }




    return (
        <div>
            {
                isLoggedIn? <button onClick={applyClick} type="button">Apply</button> : null
            }

            <button type="button" onClick={mainClick}>Main</button>
            { owner && <button type="button" onClick={onEditClick}>Edit</button> }

            {editMode ? <ProjectDetailsEdit project={projectState} /> : <ProjectDetailsInfo project={projectState} />}
        </div>
    );
}

export default ProjectDetails;


