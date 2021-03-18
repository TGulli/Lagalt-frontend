import {useSelector} from "react-redux";

function CollabRequests(props) {

    const owner = useSelector(state => state.user)

    function getUserId(user){
        return user.split("/").pop()
    }

    function getProjectId(project){
        return project.split("/").pop()
    }

    const handleApproveDecline = (collaborator, status) => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user: {id: owner.id}, projectCollaborators: {id: collaborator.id, status: status, user: { id: getUserId(collaborator.user)}, project: {id: getProjectId(collaborator.project)}}})
        };
        fetch(`http://localhost:8080/api/v1/project/collaborators/${collaborator.id}`, requestOptions).then(r => console.log(r));
        props.onReload(true)
        let index = props.pendingCollaborators.pendingCollaborators.indexOf(collaborator)
        props.pendingCollaborators.pendingCollaborators.splice(index, 1)
    }

    return (
        <div>
            <p>Hello</p>
            <p>{owner.id}</p>
            <p>Length:  {props.pendingCollaborators.pendingCollaborators.length}</p>
            {props.pendingCollaborators.pendingCollaborators.map(collaborator => (
                <div key={collaborator.id}>
                    <p > P: {collaborator.name} </p>
                    <button  type="button" onClick={() => handleApproveDecline(collaborator,1)}>Approve</button>
                    <button type="button" onClick={() => handleApproveDecline(collaborator,2)}>Decline</button>
                </div>))}
        </div>
    );
}export default CollabRequests;