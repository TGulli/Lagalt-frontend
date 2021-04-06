import {useHistory, NavLink} from "react-router-dom";
import styles from './MainProjectListOwners.module.css'
import {Button} from "react-bootstrap";

function MainProjectListOwners({owners}) {

    const history = useHistory();


    /**
     * Function that is called when the user clicks on a users profile picture.
     * The function redirects the user to the profile page.
     * */
    const onUserProfileClick = param => () =>  {
        history.push('/userprofile/' + param.toString())
    }


    return (
        <div>
            {owners && owners.map((owner, index) => {
                return <div className={styles.ownersContainer}>
                    <h4 id="owner"><NavLink to={"/userprofile/" + owner.id} activeClassName="selected"> {owner.name}</NavLink></h4>
                </div>
            })}
        </div>
    );
}
export default MainProjectListOwners;
