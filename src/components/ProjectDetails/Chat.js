import "./Chat.css"
import {Button, Form, InputGroup, ListGroup} from "react-bootstrap";
function Chat(props) {


    /**
     * Format the messages in the chat view based on
     * the type of the message: join, leave or message
     * */
    const formatMessage = msg => {
        if(msg.type === 'JOIN'){
            return (
                <li className="li-chat_join_leave" key={msg.id}>
                    {msg.sender} ble med
                </li>
            )
        }else if(msg.type === 'CHAT'){
            console.log("msg.sender" + msg.sender)
            console.log("props.user.name" + props.user.name)
            if (msg.sender === props.user.name){
                return(
                    <li key={msg.id}>
                        <div className="message-wrapper-me">
                            <p>{msg.sender} &nbsp;&nbsp;&nbsp;&nbsp; {msg.timestamp}</p>
                            <p>{msg.content}</p>
                        </div>
                    </li>
                )
            }
            else{
                return (
                    <li key={msg.id}>
                        <div className="message-wrapper-other">
                            <p>{msg.sender} &nbsp;&nbsp;&nbsp;&nbsp; {msg.timestamp}</p>
                            <p>{msg.content}</p>
                        </div>
                    </li>
                )
            }
        }else if(msg.type === 'LEAVE'){
            return (
                <li className="li-chat_join_leave" key={msg.id}>
                    {msg.sender} forlot chatten
                </li>
            )
        }
    }



    return (
       <>
           <section className="chatContainer">
               <div className="wrapper-chat">
                   <ListGroup className="ul-chat">
                       {props.chatMessages.map(msg => formatMessage(msg))}
                   </ListGroup>
               </div>
               <InputGroup className="input-group-chat">
                   <Form.Control
                       type="text"
                       placeholder="Skriv en melding"
                       onChange={props.onChange}
                       value={props.chatText}
                   />
                   <InputGroup.Append>
                       <Button variant="outline-success"
                               type="button"
                               onClick={props.onSendMessage}>
                           Send
                       </Button>
                   </InputGroup.Append>
                   <InputGroup.Append>
                       <Button variant="outline-danger"
                               type="button"
                               onClick={props.onLeave}>
                           Forlat
                       </Button>
                   </InputGroup.Append>
               </InputGroup>
           </section>
       </>
    )

}export default Chat;
