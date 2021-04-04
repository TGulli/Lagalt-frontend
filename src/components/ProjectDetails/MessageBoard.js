import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchMessages} from "./MessageBoardAPI";
import MessageBoardText from "./MessageBoardText";
import {Button, Form, InputGroup, ListGroup} from "react-bootstrap";

function MessageBoard(props) {
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState({
        messages: []
    });
    const user  = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const [username, setUsername] = useState('')
    const [reload, setReload] = useState(false);
    const [isPartOfProject, setIsPartOfProject] = useState(false);
    let { id } = useParams();


    useEffect(() => {
        console.log("I useeffect")
        async function fetchMessagesFromApi(){
            await fetchMessages(id, user.id, token)
                .then(jsonResponse => {
                    if(jsonResponse !== null) {
                        setIsPartOfProject(true)
                        console.log("JsonRESPONSE Length:" + jsonResponse.length)
                        console.log(jsonResponse)

                        for (let message of jsonResponse) {

                            async function getUserFetch(message) {
                                let user = await getUser(message.user)
                                return user.name
                            }

                            let user = getUserFetch(message).then(response => setMessages(messages => ({
                                messages: [...messages.messages, {
                                    ...message,
                                    name: response
                                }]
                            })));

                        }
                    }
                    else{
                        setIsPartOfProject(false)
                    }
            });

        }
        fetchMessagesFromApi();


    }, [reload])

    async function getUser(user){

        let userObject =  await fetch(`http://localhost:8080${user}`, {headers: {'Authorization': ('Bearer ' + token.token)}}).then(response => response.json())

        return userObject;

    }


    const handleInputChange = e => {
        setMessageText(e.target.value);
    }

    const newMessage = () => {
        setMessageText('')

        let today = new Date();
        let month = today.getMonth()+1;
        if(month < 10){
            month = '0' + month;
        }
        let date = today.getDate()+'.'+month+'.'+today.getFullYear();
        let hour = today.getHours();
        if(hour < 10){
            hour = '0' + hour;
        }
        let minutes = today.getMinutes();
        if(minutes < 10){
            minutes = '0' + minutes;
        }
        let time = hour + ':' + minutes;
        let dateTime = date+' '+time;
        console.log(dateTime);

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
            body: JSON.stringify( {content: messageText, timestamp: dateTime, project: {id: id}, user: {id: user.id}})
        };
        fetch('http://localhost:8080/api/v1/messages', requestOptions).then(r => {console.log(r)
            setMessages({messages: []})
            reload? setReload(false): setReload(true)
        });
    }


    return(
        <>
            <section className="message-boardContainer">
                <div className="wrapper-chat">
                    <ListGroup className="ul-chat">
                        <MessageBoardText messages={messages.messages}
                                          user={user}/>
                    </ListGroup>
                </div>
                {isPartOfProject && <InputGroup className="input-group-chat">
                    <Form.Control
                        type="text"
                        placeholder="Skriv en melding"
                        value={messageText}
                        onChange={handleInputChange}
                    />
                    <InputGroup.Append>
                        <Button variant="outline-success"
                                type="button"
                                onClick={newMessage}>
                            Send
                        </Button>
                    </InputGroup.Append>
                </InputGroup>}
            </section>
        </>
    );

}
export default MessageBoard;
