import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchMessages} from "./MessageBoardAPI";
import MessageBoardText from "./MessageBoardText";
import {Button, Form, InputGroup, ListGroup} from "react-bootstrap";

function MessageBoard(props) {

    //States
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState({
        messages: []
    });
    const [reload, setReload] = useState(false);
    const [isPartOfProject, setIsPartOfProject] = useState(false);

    //Id from the path
    let { id } = useParams();

    //Global states
    const user  = useSelector(state => state.user);
    const token = useSelector(state => state.token);


    /**
     * On loading, fetches messages from the API.
     * The returned message objects only contains the id of the sender,
     * to get the name of the sender another fetch is done from the API.
     * The messages is added to a list together with the names of the senders.
     * */
    useEffect(() => {
        async function fetchMessagesFromApi(){
            await fetchMessages(id, user.id, token)
                .then(jsonResponse => {
                    if(jsonResponse !== null) {
                        setIsPartOfProject(true)

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

    /**
     * Function to fetch the sender of a message from the API.
     */
    async function getUser(user){

        let userObject =  await fetch(`https://lagalt-service.herokuapp.com${user}`,
            {headers: {'Authorization': ('Bearer ' + token.token)}})
            .then(response => response.json())

        return userObject;

    }

    /**
     * Set the new message when the user updates the input field.
     * */
    const handleInputChange = e => {
        setMessageText(e.target.value);
    }

    /**
     * When the user clicks send message, the timestamp is formatted and
     * the new message is posted to the API. The reload state is updated to
     * execute the  useEffect. The messageText state is set to the empty string.
     * */
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

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
            body: JSON.stringify( {content: messageText, timestamp: dateTime, project: {id: id}, user: {id: user.id}})
        };
        fetch('https://lagalt-service.herokuapp.com/api/v1/messages', requestOptions).then(r => {
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
