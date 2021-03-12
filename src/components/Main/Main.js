import MainProjectList from "./MainProjectList";
import {useHistory} from "react-router-dom";
import {useState, useEffect} from 'react';


function Main() {
    const history = useHistory();
    const user = localStorage.getItem('user')


    const [ projectsState, setProjectsState ] = useState([{}])

    useEffect( () => {
        async function fetchData() {
            await fetch("http://localhost:8080/api/v1/projects")
                .then(response => response.json())
                .then((jsonResponse) => {
                    setProjectsState(jsonResponse)
                })
        }
        fetchData();
    }, []);

    const loginClick = () => {
        history.push('/login')
    }

    const profileClick = () => {
        history.push('/myprofile')
    }

    const logoutClick = () => {
        localStorage.clear()
    }

    const createProjectClick = () => {
        history.push("/project/create")
    }

    return (
        <div>
            <h1>Main!</h1>

            <div>
                {user === null?
                    <button type="button" onClick={loginClick}> Login</button> :
                    <div>
                        <button type="button" onClick={profileClick}> Profile</button>
                        <button type="button" onClick={logoutClick}> Log out</button>
                        <button type="button" onClick={createProjectClick}> Create project</button>
                    </div>}
                <MainProjectList content={projectsState}/>
            </div>
            <div>

            </div>

        </div>
    );
}

export default Main;


