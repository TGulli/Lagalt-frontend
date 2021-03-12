import {useHistory} from "react-router-dom";

function MainProjectListOwners({owners}) {

    const history = useHistory();

    const onUserProfileClick = param => () =>  {
        history.push('/userprofile/' + param.toString())
    }


    return (
        <div>
            {owners && owners.map((owner, index) => (
                <button key={index} onClick={onUserProfileClick(owner.id)}><p>Owner: {owner.name}</p></button>
            ))}
        </div>
    );
}
export default MainProjectListOwners;
