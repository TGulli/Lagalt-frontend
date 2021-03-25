import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchMessages} from "./MessageBoardAPI";
import MessageBoardText from "./MessageBoardText";

function MessageBoard(props) {
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState({
        messages: []
    });
    const user  = useSelector(state => state.user);
    const [username, setUsername] = useState('')
    const [reload, setReload] = useState(false);
    const [isPartOfProject, setIsPartOfProject] = useState(false);
    let { id } = useParams();


    useEffect(() => {
        console.log("I useeffect")
        async function fetchMessagesFromApi(){
            await fetchMessages(id, user.id)
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

        let userObject =  await fetch(`http://localhost:8080${user}`).then(response => response.json())

        return userObject;

    }


    const handleInputChange = e => {
        setMessageText(e.target.value);
    }

    const newMessage = () => {

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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify( {content: messageText, timestamp: dateTime, project: {id: id}, user: {id: user.id}})
        };
        fetch('http://localhost:8080/api/v1/messages', requestOptions).then(r => {console.log(r)
            setMessages({messages: []})
            reload? setReload(false): setReload(true)
        });
    }


    return(
        <>
            {console.log("Messages.length: "+  messages.messages.length)}
            {console.log(messages.messages)}
            <MessageBoardText messages={messages.messages}/>
            {isPartOfProject &&
                <form>
                    <input type="text" onChange={handleInputChange}/>
                    <button type="button" onClick={newMessage}>Add message</button>
                </form>
            }
            <br/>
            <br/>

        </>

    );

}
export default MessageBoard;
