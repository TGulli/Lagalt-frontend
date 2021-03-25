import MainProjectList from "./MainProjectList";
import {useHistory} from "react-router-dom";
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../redux/actions";
import {fetchData} from "./MainAPI";
import TagList from "../shared/TagList";


function Main() {

    /**
     * TODO: MIDDLEWARE TO SOLVE PAGINATION PROBLEM
     * TODO: useEffect renders only once when given empty array as second argument
     */

    const user = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const history = useHistory();

    const [projectsState, setProjectsState] = useState([{}])
    const [filteredState, setFilteredState] = useState([{}])

    // Might refactor
    const [ totalPages, setTotalPages ] = useState(0);
    const [ pageNr, setPageNr] = useState(0);
    const [ searchState, setSearchState ] = useState('')

    console.log('MAIN USER:' + JSON.stringify(user))
    console.log('MAIN TOKEN:' + JSON.stringify(token))

    useEffect( () => {
        async function fetchFromApi() {
            let response = await fetchData(pageNr);
            console.log(response);
            setTotalPages(response.totalPages)
            setProjectsState(response.content)
            setFilteredState(response.content)
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
        await fetch("http://localhost:8080/api/v1/public/projects")
            .then(response => response.json())
            .then((jsonResponse) => {
                jsonResponse = jsonResponse.filter((obj) =>
                    obj.name.toLowerCase().includes(searchState.toLowerCase())
                )
                setProjectsState(jsonResponse)
                setFilteredState(jsonResponse)
            })
    }

    const onInputChange = e => {
        setSearchState(e.target.value)
    }

    const onFilterBasedOnMusicClick = () => {
        setFilteredState(projectsState.filter(x => x.category === 'Music'));
    }

    const onFilterBasedOnFilmClick = () => {
        setFilteredState(projectsState.filter(x => x.category === 'Film'));
    }

    const onRemoveFilterClick = () => {
        setFilteredState(projectsState)
    }

    const onNextClick = async () => {
        console.log("pageNr " + pageNr)
        if (pageNr < totalPages - 1) {
            let response = await fetchData(pageNr + 1);
            setPageNr(pageNr + 1)
            setFilteredState(response.content);
        }
    }

    const onPreviousClick = async () => {
        console.log("pageNr " + pageNr)
        if (pageNr > 0) {
            let response = await fetchData(pageNr - 1);
            setPageNr(pageNr - 1)
            setFilteredState(response.content);
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
                {!isLoggedIn ?
                    <button type="button" onClick={loginClick}> Login</button> :
                    <div>
                        <h2> {user.username} </h2>
                        {user.userTags && <TagList tags={user.userTags}/>}
                        <button type="button" onClick={profileClick}> Profile</button>
                        <button type="button" onClick={logoutClick}> Log out</button>
                        <button type="button" onClick={createProjectClick}> Create project</button>
                    </div>}
                <div>
                    <h4>Filter based on category (RADIO BUTTONS? DROPDOWN? )</h4>
                    <button type="button" onClick={onFilterBasedOnMusicClick}>Music</button>
                    <button type="button" onClick={onFilterBasedOnFilmClick}>Film</button>
                    <button type="button" onClick={onRemoveFilterClick}>Remove filters</button>
                </div>
                <MainProjectList content={filteredState} userState={user}/>
                {(pageNr >= 1) && <button type="button" onClick={onPreviousClick}>PREVIOUS</button>}
                {(pageNr < totalPages-1) && <button type="button" onClick={onNextClick}>NEXT</button>}

            </div>
            <div>

            </div>

        </div>
    );
}

export default Main;


