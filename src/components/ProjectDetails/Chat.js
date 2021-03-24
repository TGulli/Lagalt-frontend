function Chat(props) {

    const formatMessage = msg => {
        if(msg.type === 'JOIN'){
            console.log("IF JOIN MSG")
            console.log(msg)
            return (
                <li key={msg.timestamp}>{msg.sender} joined </li>
            )

        }else if(msg.type === 'CHAT'){
            return (
                <li key={msg.timestamp}>
                    <p>{msg.sender}    {msg.timestamp}</p>
                    <p> {msg.content}</p>
                </li>)

        }else if(msg.type === 'LEAVE'){
            return (
                <li key={msg.timestamp}>{msg.sender} left </li>
            )
        }
    }



    return (
       <>
           <ul> {props.chatMessages.map(msg => formatMessage(msg))} </ul>
           <input type="text" placeholder="Type a new message" onChange={props.onChange}/>
           <button type="button" onClick={props.onSendMessage}>Send</button>
           <button type="button" onClick={props.onLeave}>Logout</button>

       </>
    )

}export default Chat;
