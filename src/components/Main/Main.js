import MainProjectList from "./MainProjectList";
import {useHistory} from "react-router-dom";
import {useState, useEffect} from 'react';
import {getUser} from "../../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../redux/actions";


function Main() {

    const user = useSelector(state => state.user)
    const isLoggedIn= useSelector(state => state.isLoggedIn)
    const history = useHistory();

    const [ projectsState, setProjectsState ] = useState([{}])
    const [ searchState, setSearchState ] = useState('')

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

    const dispatch = useDispatch();

    const logoutClick = () => {
        dispatch(logOut())
        //localStorage.clear()
    }

    const createProjectClick = () => {
        history.push("/project/create")
    }

    const search = async () => {
        await fetch("http://localhost:8080/api/v1/projects")
            .then(response => response.json())
            .then((jsonResponse) => {
                jsonResponse = jsonResponse.filter((obj) =>
                    obj.name.toLowerCase().includes(searchState.toLowerCase())
                )
                setProjectsState(jsonResponse)
                //console.log(jsonResponse)
            })
        //console.log(searchState)
    }

    const onInputChange = e => {
        setSearchState(e.target.value)
    }

    return (
        <div>
            <h1>Main!</h1>
            <fieldset>
                <input id="searchInput" onChange={onInputChange}/>
                <button type="button" onClick={search}>Submit</button>
            </fieldset>
            <div>
                {!isLoggedIn?
                    <button type="button" onClick={loginClick}> Login</button>:
                    <div>
                        <h2> {user.name} </h2>
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


