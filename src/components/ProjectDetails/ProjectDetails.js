import { useState, useEffect } from 'react'
import {useHistory, useParams} from "react-router-dom";

function ProjectDetails() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [projectState, setProjectState] = useState('')
    const history = useHistory()
    let { id } = useParams();


    //fetch(`http://localhost:8080/api/v1/users/get/${user.id}`).then(res => res.json()).then((x) => setUserState(x))

    useEffect( () => {
        async function fetchData() {
            await fetch(`http://localhost:8080/api/v1/projects/get/${id}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    setProjectState(jsonResponse);
                })
        }
        fetchData();
    }, []);



    const mainClick = () => {
        history.push('/')
    }


    return (
        <div>
            <h1>{projectState.name}</h1>
            <p>ID: {projectState.id}</p>
            <p>Description: {projectState.description}</p>
            <p>Image: {projectState.image}</p>
            <button type="button" onClick={mainClick}>Main</button>
        </div>
    );
}

export default ProjectDetails;


