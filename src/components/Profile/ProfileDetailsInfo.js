import {useHistory} from "react-router-dom";
import TagList from "../shared/TagList";

function ProfileDetailsInfo({user}) {

    console.log(user)

    const history = useHistory()


    return (
        <div>
            <h1>COMPONENT</h1>
            <p>User id: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>User Secret: {user.secret}</p>

        </div>
    );


}

export default ProfileDetailsInfo;
