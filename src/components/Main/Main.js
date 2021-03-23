import MainProjectList from "./MainProjectList";
import {useHistory} from "react-router-dom";
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../redux/actions";
import {fetchData} from "./MainAPI";


function Main() {

    /**
     * TODO: MIDDLEWARE TO SOLVE PAGINATION PROBLEM
     * TODO: useEffect renders only once when given empty array as second argument
     */

    const user = useSelector(state => state.user)
    const isLoggedIn= useSelector(state => state.isLoggedIn)
    const token = useSelector(state => state.token)
    const history = useHistory();

    const [ projectsState, setProjectsState ] = useState([{}])

    // Might refactor
    const [ totalPages, setTotalPages ] = useState(0);
    const [ pageNr, setPageNr] = useState(0);
    const [ searchState, setSearchState ] = useState('')

    console.log('MAIN USER:' + JSON.stringify(user))
    console.log('MAIN TOKEN:' + JSON.stringify(token))

    useEffect( () => {
        async function fetchFromApi() {
            let response = await fetchData(pageNr, token);
            setTotalPages(response.totalPages)
            setProjectsState(response.content)
            console.log(response)
        }
        fetchFromApi()
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
            })
    }

    const onInputChange = e => {
        setSearchState(e.target.value)
    }

    const onNextClick = async () => {
        console.log("pageNr " + pageNr)
        if (pageNr < totalPages -1){
            let response = await fetchData(pageNr +1);
            setPageNr(pageNr + 1)
            setProjectsState(response.content);
        }
    }

    const onPreviousClick = async () => {
        console.log("pageNr " + pageNr)
        if (pageNr > 0){
            let response = await fetchData(pageNr -1);
            setPageNr(pageNr - 1)
            setProjectsState(response.content);
        }
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
                <button type="button" onClick={onPreviousClick}>PREVIOUS</button>
                <button type="button" onClick={onNextClick}>NEXT</button>
            </div>
            <div>

            </div>

        </div>
    );
}

export default Main;


