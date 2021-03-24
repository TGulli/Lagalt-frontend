function MessageBoardText({messages}){

    return(
        <>
            {messages.map((message, index) => (
                <div key={index}>
                    <p> id : {message.id}</p>
                    <p > text: {message.content} </p>
                    <p> date: {message.timestamp}</p>
                    <p>userstring: {message.name}</p>

                    <br/>
                </div>))}
                </>
    )

}export default MessageBoardText;
