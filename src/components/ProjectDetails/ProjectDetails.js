import { useState, useEffect } from 'react'
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import ProjectDetailsInfo from "./ProjectDetailsInfo";
import ProjectDetailsEdit from "./ProjectDetailsEdit";
import CollabRequests from "./CollabRequests";


function ProjectDetails() {
    const [pendingCollaborators, setPendingCollaborators] = useState({
        pendingCollaborators: []
    })
    const [reload, setReload] = useState(false)
    const user = useSelector(state => state.user);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const [projectState, setProjectState] = useState('')
    const [editMode, setEditMode] = useState(false)
<<<<<<< HEAD
    const [handleRequestsMode, setHandleRequestsMode] = useState(false)
=======
    const [hasApplied, setHasApplied] = useState(false)
>>>>>>> create_application
    const [owner, setOwner] = useState(false);
    const [message, setMessage] = useState('')
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
                    //Check if applicant
                    for (let projectApplicant of jsonResponse.collaborators) {
                        if (projectApplicant.id === user.id) setHasApplied(true);
                    }

                })
        }
        fetchData();
        setReload(false)
    }, [id, reload]);

    const mainClick = () => {
        history.push('/')
    }

<<<<<<< HEAD
    const applyClick = async () => {
        const userId = user.id;
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user: { id: userId }, project: {id: id}, status: 0})
        };
        let response = await fetch('http://localhost:8080/api/v1/project/collaborators', requestOptions);
        if (response.status === 200){
            window.alert("Du kan ikke søke om å bli med på dette prosjektet")
        }else{
            setMessage("Du har søkt om å bli med på prosjekt " + projectState.name)
        }
=======
    const applyClick = () => {
       history.push('/project/application/', {project: projectState})
>>>>>>> create_application
    }

    const onEditClick = () => {
        editMode === true ? setEditMode(false): setEditMode(true);
    }

    const handleCollabRequests = async() => {
        if (handleRequestsMode === false){
            for (let collaborator of projectState.collaborators){
                if (collaborator.status === "PENDING"){
                    let userName = await fetchUser(collaborator)
                    let name = {name: userName}
                    setPendingCollaborators(pendingCollaborators => ({pendingCollaborators: [...pendingCollaborators.pendingCollaborators, {...collaborator, ...name}]}))
                }
            }
            setHandleRequestsMode(true)
        }else {
            setHandleRequestsMode(false)
            setPendingCollaborators({
                pendingCollaborators: []
            })
        }
        if (reload){
            setReload(false)
        }
    }

    async function fetchUser (collaborator){
        return await fetch(`http://localhost:8080${collaborator.user}`)
            .then(responseObj => responseObj.json())
            .then(jsonResponse  => jsonResponse.name)
    }


    return (
        <div>
<<<<<<< HEAD
            {isLoggedIn && <button onClick={applyClick} type="button">Apply</button>}
            {(message !== '')&& <p> {message} </p> }
=======
            { (isLoggedIn && !hasApplied) ? <button onClick={applyClick} type="button">Apply</button> : null }
>>>>>>> create_application

            <button type="button" onClick={mainClick}>Main</button>
            {owner && <button type="button" onClick={onEditClick}>Edit</button> &&
                        <button type="button" onClick={handleCollabRequests}>CollabRequests</button>}
            {handleRequestsMode? <CollabRequests pendingCollaborators={pendingCollaborators} onReload={setReload}/> : null}
            {editMode ? <ProjectDetailsEdit project={projectState} /> : <ProjectDetailsInfo project={projectState} />}
        </div>
    );
}export default ProjectDetails;


