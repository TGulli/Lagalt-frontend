import { useState, useEffect, useLayoutEffect } from 'react'
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import ProjectDetailsInfo from "./ProjectDetailsInfo";
import ProjectDetailsEdit from "./ProjectDetailsEdit";
import CollabRequests from "./CollabRequests";
import MessageBoard from "./MessageBoard";
import SockJsClient from "react-stomp"
import Chat from "./Chat"
import React from "react";


function ProjectDetails() {
    const [pendingCollaborators, setPendingCollaborators] = useState({
        pendingCollaborators: []
    })
    const [reload, setReload] = useState(false)
    const user = useSelector(state => state.user);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const [projectState, setProjectState] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [handleRequestsMode, setHandleRequestsMode] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)
    const [owner, setOwner] = useState(false)
    const [message, setMessage] = useState('')
    const [hasJoinedChat, setHasJoinedChat] = useState(false)
    const [chatText, setChatText] = useState('')
    const [chatMessages, setChatMessages] = useState([])

    //const [clientRef, setClientRef] = useState({})
    const [clientConnected, setClientConnected] = useState(false)
    const history = useHistory()
    let { id } = useParams();
    let clientRef = React.createRef();

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
    }, [id, reload, clientConnected]);

    const mainClick = () => {
        history.push('/')
    }


    const applyClick = () => {
       history.push('/project/application/', {project: projectState})
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

    const joinChat = () => {
        console.log("Clientref in jonChat(): ")
        console.log(clientRef)
        setHasJoinedChat(true);
        clientRef.sendMessage("/app/chat.addUser",
            JSON.stringify({sender: user.name, type: 0, project: projectState}))
    }

    const leaveChat = () => {
        console.log("setClientConnect() (before disconnect)" + clientConnected)
        console.log(clientRef.disconnect)
        setHasJoinedChat(false);
        setChatMessages([]);
        clientRef.disconnect();
        window.location.reload()
        console.log(clientRef)
        //setTimeout(function(){ alert("Hello"); }, 3000);
        //clientRef.connect();
        console.log("setClientConnect() (after disconnect)" + clientConnected)
        //clientRef.connect();
        reload? setReload(false): setReload(true)
    }

    const sendChatMessage = () => {
        console.log("INSIDE SEND CHAT MSG")
        console.log("CHATTEXT:     " + chatText)
        clientRef.sendMessage("/app/chat.sendMessage",
            JSON.stringify({sender: user.name, content: chatText, type: 1, project: projectState}))

    }

    const handleChange = e => {
        setChatText(e.target.value)
    }

    const handleMessageReceived = msg => {
        setChatMessages([...chatMessages, msg])
    }

    return (
        <div>
            <SockJsClient url='http://localhost:8080/ws' topics={['/topic/public']}
                          onMessage={(msg) => handleMessageReceived(msg)}
                          ref={(client) => {
                              clientRef = client;
                          }}
                          onConnect={ () => { setClientConnected(true) } }
                          onDisconnect={() => {setClientConnected(false)}}
            />
            {console.log("IN HTML: " + clientConnected)}
            {hasJoinedChat? <Chat chatMessages={chatMessages} chatText={chatText} onSendMessage={()=> sendChatMessage()} onChange={e => handleChange(e)} onLeave={() => leaveChat()}  />:
                <button type="button" onClick={joinChat}> Join chat</button>}
            { (isLoggedIn && !hasApplied) ? <button onClick={applyClick} type="button">Apply</button> : null }

            <button type="button" onClick={mainClick}>Main</button>
            {owner && <button type="button" onClick={onEditClick}>Edit</button> &&
                        <button type="button" onClick={handleCollabRequests}>CollabRequests</button>}
            {handleRequestsMode? <CollabRequests pendingCollaborators={pendingCollaborators} onReload={setReload}/> : null}
            {editMode ? <ProjectDetailsEdit project={projectState} /> : <ProjectDetailsInfo project={projectState} />}
            <MessageBoard project={projectState}/>
        </div>
    );
}export default ProjectDetails;


