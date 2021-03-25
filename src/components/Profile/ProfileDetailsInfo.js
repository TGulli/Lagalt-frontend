import {useHistory} from "react-router-dom";
import TagList from "../shared/TagList";

function ProfileDetailsInfo({user, loginState}) {

    console.log(user)

    const history = useHistory()

    return (
        <div>
            <h1>COMPONENT</h1>
            {loginState ?
                <div>
                    <h1>is logged in and all secrets are revealed</h1>
                    <p>User id: {user.id}</p>
                    <p>Username: {user.username}</p>
                    <p>Name: {user.name}</p>
                    <p>User Secret: {user.secret}</p>
                </div>
                :
                <div>
                    <h1>is not logged in and all is safe</h1>
                    <p>Username: {user.username}</p>
                    <p>User actual name: {user.name}</p>
                </div>
            }

        </div>
    );


}

export default ProfileDetailsInfo;
