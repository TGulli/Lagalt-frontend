import {useHistory} from "react-router-dom";


(function () {
    fetch("http://localhost:8080/api/v1/users/").then(res => res.json()).then((x) => console.log(x))
})();


function Main() {
    const history = useHistory();
    const user = localStorage.getItem('user')

    const loginClick = () => {
        history.push('/login')
    }

    const profileClick = () => {
        history.push('/profile')
    }

    const logoutClick = () => {
        localStorage.clear()
    }

    return (
        <div>
            <h1>Main!</h1>

            <div>
                {user === null?
                    <button type="button" onClick={loginClick}> Login</button>:
                    <div>
                        <button type="button" onClick={profileClick}> Profile</button>
                        <button type="button" onClick={logoutClick}> Log out</button>
                    </div>}

            </div>
            <div>

            </div>

        </div>
    );
}

export default Main;


