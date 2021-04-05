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
import {Button, Tabs, Tab} from "react-bootstrap";


function ProjectDetails() {

    //Global states
    const user = useSelector(state => state.user);
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const token = useSelector(state => state.token);

    //States
    const [pendingCollaborators, setPendingCollaborators] = useState([])
    const [reload, setReload] = useState(false)
    const [projectState, setProjectState] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [handleRequestsMode, setHandleRequestsMode] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)
    const [owner, setOwner] = useState(false);
    const [hasJoinedChat, setHasJoinedChat] = useState(false)
    const [chatText, setChatText] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [isPartOfProject, setIsPartOfProject] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [clientConnected, setClientConnected] = useState(false)

    //History for redirecting
    const history = useHistory()

    //Parameter from the path
    let {id} = useParams();

    //Socket client
    let clientRef = null;

    /**
     * Fetches the given project from the API. If the user is not logged in,
     * limited details on the project will be fetched,
     * if the user is logged in the whole project will be fetched.
     * If the fetch returns an error, the user is redirected to the main page.
     * If the current user is the owner of the project the owner state is set to true,
     * if the current user has applied to the project, the state hasApplied is set to true.
     * */
    useEffect(() => {
        async function fetchData() {
            if (isLoggedIn) {
            await fetch(`https://lagalt-service.herokuapp.com/api/v1/projects/${id}`, {
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + token.token}
            })
                .then(response =>
                    response.json())
                .then((jsonResponse) => {

                    if(jsonResponse.status === 400){
                        return history.push("/")
                    }

                    setProjectState(jsonResponse);
                    if (jsonResponse.owner.id === user.id) setOwner(true);
                    //Check if applicant
                    for (let projectApplicant of jsonResponse.collaborators) {
                        if (projectApplicant.user === user.id) setHasApplied(true);
                    }
                    })
            }
            else {
                await fetch(`https://lagalt-service.herokuapp.com/api/v1/public/projects/${id}`, {
                    method: 'GET',
                })
                    .then(response => response.json())
                    .then((jsonResponse) => {
                        if(jsonResponse.status === 400){
                            return history.push("/")
                        }
                        setProjectState(jsonResponse);
                    })
            }
        }
        fetchData();
        setReload(false)

    }, [id, reload, editMode]);


    /**
     * Fetches the messages from the chat from the API.
     * If the fetch returns ok, the response is set to the chatmessages state and the
     * isPartOfProject is set to true. If not, the isPartOfProject state is set to false.
     * */
    useEffect(() => {
        async function getMessages() {
            if (isLoggedIn) {
                await fetch(`https://lagalt-service.herokuapp.com/api/v1/chatmessages/project/${id}/user/${user.id}`, {headers: {'Authorization': ('Bearer ' + token.token)}})
                    .then(response => response.json())
                    .then(jsonResponse => {

                        if (jsonResponse.status !== 400) {
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


    /**
     * If the user clicks the apply to project button, the user is taken to the application page.
     * */
    const applyClick = () => {
        history.push('/project/application/', {project: projectState})
    }

    /**
     * If the user (owner of the project) clicks edit project, the state editMode is updated, and the
     * ProjectDetailsEdit component is displayed.
     * */
    const onEditClick = () => {
        editMode === true ? setEditMode(false) : setEditMode(true);
    }

    /**
     * If the user (owner of the project) clicks see applications,
     * the function getCollaborators is called and the returned collaborators list is added
     * to the pendingCollaboratorsList. reload state is updated, to execute the useEffect.
     * */
    const handleCollabRequests = async () => {
        if (handleRequestsMode === false) {

            let collaboratorList = await getCollaborators(projectState.id)

            setPendingCollaborators(collaboratorList)

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

    /**
     * Fetches the collaborators from the API and return a list of the collaborators.
     * */
    async function getCollaborators(id) {
        const requestOptions = {
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)}
        };
        return await fetch(`https://lagalt-service.herokuapp.com/api/v1/project/${id}/collaborators/`, requestOptions)
            .then(responseObj => responseObj.json())
            .then(jsonResponse => jsonResponse)
    }


    /**
     * When the user opens the chat a joined chat message is created and posted to the API.
     * */
    const joinChat = () => {
        setHasJoinedChat(true);
        clientRef.sendMessage("/app/chat.addUser",
            JSON.stringify({
                user: {id: user.id},
                message: {sender: user.name, type: 0, project: {id: projectState.id}}
            }))
    }

    /**
     * When the user leaves the chat the joinedChat state is set to false and the socket is disconnected.
     * The window is reloaded to connect to the socket again.
     * */
    const leaveChat = () => {

        setHasJoinedChat(false);
        clientRef.disconnect();
        window.location.reload()
        clientRef.connect();

        setChatMessages([]);
        reload ? setReload(false) : setReload(true)
    }

    /**
     * When the user posts a new message, it is posted to the API
     * */
    const sendChatMessage = () => {
        clientRef.sendMessage("/app/chat.sendMessage",
        JSON.stringify({sender: user.name, content: chatText, type: 1, project: {id: projectState.id}}))
        setChatText('')

    }

    /**
     * Set the chatText when the user adds a message to the inputfield.
     * */
    const handleChange = e => {
        setChatText(e.target.value)
    }

    /**
     * When a new message is added to the chat, the message is added to the chatMessages state.
     * */
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
            {isLoggedIn ?
                <div className={styles.contentWrapper}>
                    {(isPartOfProject || owner) &&
                    <SockJsClient url='https://lagalt-service.herokuapp.com/ws'
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
                    />}
                    <div className={styles.content}>
                        <Tabs defaultActiveKey="projectview" >
                            <Tab eventKey="projectview" title={projectState.name}>
                                {editMode ? <ProjectDetailsEdit project={projectState} setEditMode={setEditMode}/> :
                                    <ProjectDetailsInfo project={projectState}/>}
                                {!editMode &&
                                <div className={styles.applyWrapper}>
                                    {owner && <Button type="button" onClick={onEditClick}>Rediger prosjekt</Button>}
                                    {(isLoggedIn && !hasApplied && !owner) && <Button onClick={applyClick} type="button">Forespør om å bli deltaker</Button>}
                                </div>}
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
                                {(isPartOfProject || owner) && <Button className={styles.buttonChat} type="button" onClick={() => setHasJoinedChat(true)}>Chat</Button> }
                            </Tab>
                            {(isPartOfProject || owner) &&
                            <Tab eventKey="messageboard" title="meldingsbord">
                                <MessageBoard project={projectState}/>
                            </Tab>}
                        </Tabs>
                    </div>
                    {((isPartOfProject || owner) && hasJoinedChat) &&
                        <div className={styles.chatDiv}>
                            <Chat chatMessages={chatMessages}
                                  chatText={chatText}
                                  onSendMessage={()=> sendChatMessage()}
                                  onChange={e => handleChange(e)}
                                  onLeave={() => leaveChat()}
                                  user={user}/>
                        </div>
                    }
            </div> :
                <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                        { projectState && <ProjectDetailsInfo project={projectState} />}
                    </div>
                </div>}
        </div>
    );
}

export default ProjectDetails;


