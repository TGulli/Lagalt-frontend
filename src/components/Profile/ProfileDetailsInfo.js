import {useHistory} from "react-router-dom";
import TagList from "../shared/TagList";

function ProfileDetailsInfo({user}) {


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
