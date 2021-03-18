import {useHistory} from "react-router-dom";

function ProfileDetailsInfo({user}) {

    console.log(user)

    const history = useHistory()


    return (
        <div>
            <h1>COMPONENT</h1>
            <p>User id: {user.id}</p>
            <p>TAGS: "empty"</p>
            <p>User Name: {user.name}</p>
            <p>User Secret: {user.secret}</p>

        </div>
    );


}

export default ProfileDetailsInfo;
