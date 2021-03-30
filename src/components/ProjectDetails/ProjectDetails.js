import {useState, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import ProjectDetailsInfo from "./ProjectDetailsInfo";
import ProjectDetailsEdit from "./ProjectDetailsEdit";
import CollabRequests from "./CollabRequests";
import MessageBoard from "./MessageBoard";
import SockJsClient from "react-stomp"
import Chat from "./Chat"
import React from "react";
import styles from './ProjectDetails.module.css'
import {Button, ButtonGroup, ToggleButton, ToggleButtonGroup} from "react-bootstrap";


function ProjectDetails() {
    const [pendingCollaborators, setPendingCollaborators] = useState({
        pendingCollaborators: []
    })
    const [reload, setReload] = useState(false)
    const user = useSelector(state => state.user);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const token = useSelector(state => state.token);
    const [projectState, setProjectState] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [handleRequestsMode, setHandleRequestsMode] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)
    const [owner, setOwner] = useState(false);
    const [message, setMessage] = useState('')
    const [hasJoinedChat, setHasJoinedChat] = useState(false)
    const [chatText, setChatText] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [isPartOfProject, setIsPartOfProject] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [approvedCollaborators, setApprovedCollaborators] = useState([{}])

    const [clientConnected, setClientConnected] = useState(false)
    const history = useHistory()
    let {id} = useParams();
    let clientRef = null;


    useEffect(() => {
        async function fetchData() {
            if (isLoggedIn) {
            await fetch(`http://localhost:8080/api/v1/projects/${id}`, {
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + token.token}
            })
                .then(response => response.json())
                .then((jsonResponse) => {
                    setProjectState(jsonResponse);
                    for (let projectOwner of jsonResponse.owners) {
                        if (projectOwner.id === user.id) setOwner(true);
                    }
                    //Check if applicant
                    console.log("jsonresponse: " + JSON.stringify(jsonResponse))
                    for (let projectApplicant of jsonResponse.collaborators) {
                        // if (projectApplicant.status === "APPROVED") {
                        //     let userName = await fetchUser(projectApplicant)
                        //     setApprovedCollaborators([...approvedCollaborators, userName])
                        // }
                        if (projectApplicant.user === user.id) setHasApplied(true);
                    }

                    })
            }
            else {
                await fetch(`http://localhost:8080/api/v1/public/projects/${id}`, {
                    method: 'GET',
                })
                    .then(response => response.json())
                    .then((jsonResponse) => {
                        setProjectState(jsonResponse);
                        console.log('PARTIAL HENTET FRA API')
                    })
            }
        }

        fetchData();


        setReload(false)
    }, [id, reload, editMode]);

    useEffect(() => {
        async function getMessages() {
            if (isLoggedIn) {
                await fetch(`http://localhost:8080/api/v1/chatmessages/project/${id}/user/${user.id}`, {headers: {'Authorization': ('Bearer ' + token.token)}})
                    .then(response => response.json())
                    .then(jsonResponse => {
                        console.log('this totally happened')

                        if (jsonResponse !== null) {
                            setIsPartOfProject(true)
                            setChatMessages(jsonResponse)

                        } else {
                            setIsPartOfProject(false)
                        }

                    }).catch(e => console.log(e.message))
            }
        }
        getMessages()
    }, [hasJoinedChat])

    const mainClick = () => {
        history.push('/')
    }


    const applyClick = () => {
        history.push('/project/application/', {project: projectState})
    }

    const onEditClick = () => {
        editMode === true ? setEditMode(false) : setEditMode(true);
    }

    const handleCollabRequests = async () => {
        if (handleRequestsMode === false) {

            for (let collaborator of projectState.collaborators) {
                console.log(JSON.stringify(collaborator))
                if (collaborator.status === "PENDING") {
                    let userName = await fetchUser(collaborator)
                    console.log(userName)
                    let name = {name: userName}
                    setPendingCollaborators(pendingCollaborators => ({pendingCollaborators: [...pendingCollaborators.pendingCollaborators, {...collaborator, ...name}]}))
                }
            }
            setHandleRequestsMode(true)
        } else {
            setHandleRequestsMode(false)
            setPendingCollaborators({
                pendingCollaborators: []
            })
        }
        if (reload) {
            setReload(false)
        }
    }

    async function fetchUser(collaborator) {
        const requestOptions = {
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)}
        };
        return await fetch(`http://localhost:8080/api/v1/users/${collaborator.user}`, requestOptions)
            .then(responseObj => responseObj.json())
            .then(jsonResponse => jsonResponse.name)
    }

    const joinChat = () => {
        setHasJoinedChat(true);
        console.log('JOIN CHAT')
        clientRef.sendMessage("/app/chat.addUser",
            JSON.stringify({
                user: {id: user.id},
                message: {sender: user.name, type: 0, project: {id: projectState.id}}
            }))
    }


    const leaveChat = () => {

        setHasJoinedChat(false);
        clientRef.disconnect();
        window.location.reload()
        clientRef.connect();

        setChatMessages([]);
        reload ? setReload(false) : setReload(true)
    }

    const sendChatMessage = () => {
        clientRef.sendMessage("/app/chat.sendMessage",
        JSON.stringify({sender: user.name, content: chatText, type: 1, project: {id: projectState.id}}))
        setChatText('')

    }

    const handleChange = e => {
        setChatText(e.target.value)
    }

    const handleMessageReceived = msg => {
        if (msg !== null) {
            setChatMessages([...chatMessages, msg])
        }

    }

    const radios = [
        { name: 'Active', value: '1' },
        { name: 'Radio', value: '2' },
        { name: 'Radio', value: '3' },
    ];

    const setValueShowChat = (val) =>{
        if (val === 'true'){
            setShowChat(true)
            joinChat()
        } else if (val === 'false'){
            setShowChat(false)
            leaveChat()
        }
    }


    return (
        <div>
            <div className={styles.adminPanel}>
                {owner &&
                <div className={styles.editPanel}>

                </div>
                }
            </div>

            {isLoggedIn ?
                <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                        <div className={styles.infoContent}>
                            {editMode ? <ProjectDetailsEdit project={projectState} setEditMode={setEditMode}/> :
                                <ProjectDetailsInfo project={projectState}/>}
                            {!editMode &&
                            <div className={styles.applyWrapper}>

                                {owner && <Button type="button" onClick={onEditClick}>Rediger prosjekt</Button>}
                                {(isLoggedIn && !hasApplied && !owner) && <Button onClick={applyClick} type="button">Forespør om å bli deltaker</Button>}
                            </div>}
                        </div>
                        {owner &&
                        <div className={styles.collabContainer}>
                            <div>
                                <Button type="button" variant="secondary" onClick={handleCollabRequests}>Se søknader</Button>
                            </div>
                            <div className={styles.collaborateRequests}>
                                {handleRequestsMode ?
                                    <CollabRequests pendingCollaborators={pendingCollaborators}
                                                    onReload={setReload}/> : null}
                            </div>
                        </div>}
                        <br/>
                    </div>
                    <div className={styles.socials}>
                        {(isPartOfProject) &&
                        <React.Fragment>
                            <SockJsClient url='http://localhost:8080/ws'
                                          headers={{'Authorization': ('Bearer ' + token.token)}}
                                          topics={['/topic/public']}
                                          onMessage={(msg) => handleMessageReceived(msg)}
                                          ref={(client) => {
                                              clientRef = client;
                                          }}
                                          onConnect={() => {
                                              setClientConnected(true)
                                          }}
                                          onDisconnect={() => {
                                              setClientConnected(false)
                                          }}
                            />
                            <div className={styles.toggle}>
                                <ToggleButtonGroup name="options" value={showChat} defaultValue='false' onChange={setValueShowChat}>
                                    <ToggleButton type="radio" variant="secondary" value='false' className={styles.toggleButton} checked={!showChat} style={{width: "10em", marginRight: "1em"}}>Meldingsbord</ToggleButton>
                                    <ToggleButton type="radio" variant="secondary" value='true' className={styles.toggleButton} checked={showChat} style={{width: "10em"}}>Chat</ToggleButton>
                                </ToggleButtonGroup>
                            </div>

                            {showChat &&
                            <Chat chatMessages={chatMessages}
                                  chatText={chatText}
                                  onSendMessage={()=> sendChatMessage()}
                                  onChange={e => handleChange(e)}
                                  onLeave={() => leaveChat()}
                                  user={user}/>}
                        </React.Fragment>}
                        {!showChat && <MessageBoard project={projectState}/>}
                    </div>
                </div> :
                <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                        <div className={styles.infoContent}>
                            { projectState && <ProjectDetailsInfo project={projectState} />}
                        </div>
                    </div>
                </div>

            }
        </div>
    );
}
export default ProjectDetails;


