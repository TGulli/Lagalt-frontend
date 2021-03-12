import {useHistory} from "react-router-dom";

function ProfileDetails({user}) {

    console.log(user)

    const history = useHistory()


    const mainClick = () => {
        history.push('/')
    }

    return (
        <div>
            <h1>COMPONENT</h1>
            <p>User id: {user.id}</p>
            <p>User Name: {user.name}</p>
            <p>User Secret: {user.secret}</p>
            <button type="button" onClick={mainClick}>Main</button>
        </div>
    );


}

export default ProfileDetails;
