import {useHistory, NavLink} from "react-router-dom";
import styles from './MainProjectListOwners.module.css'
import {Button} from "react-bootstrap";

function MainProjectListOwners({owners}) {

    const history = useHistory();

    const onUserProfileClick = param => () =>  {
        history.push('/userprofile/' + param.toString())
    }


    return (
        <div>
            {owners && owners.map((owner, index) => {
                return <div className={styles.ownersContainer}>
                    <h4 id="owner"><NavLink to={"/userprofile/" + owner.id} activeClassName="selected"> {owner.name}</NavLink></h4>

                    {/*<Button key={index} id="ownerButton" variant="outline-secondary" onClick={onUserProfileClick(owner.id)}><p>{owner.name}</p></Button>*/}
                </div>
            })}
        </div>
    );
}
export default MainProjectListOwners;
