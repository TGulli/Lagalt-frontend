import styles from "./Message.module.css"

function MessageBoardText({messages, user}){

    const formatMessage = msg => {
        return(
            <li key={msg.id}>
                <div className={styles.messageWrapper}>
                    <p>
                        {msg.name}
                        <div className={styles.dateRight}>{msg.timestamp}</div>
                    </p>
                    <br/>
                    <h6>Melding:</h6>
                    <p>{msg.content}</p>
                </div>
            </li>
        )
    }

    return(
        <>
            {messages.map((message, index) => (
                <div key={index}>
                    {formatMessage(message)}
                </div>))}
        </>
    )

}export default MessageBoardText;
