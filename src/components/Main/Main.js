import MainProjectList from "./MainProjectList";
import {useHistory} from "react-router-dom";
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../redux/actions";
import {fetchData} from "./MainAPI";
import TagList from "../shared/TagList";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import styles from './Main.module.css'


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
                <InputGroup className="mb-3" bsPrefix={styles.searchContainer}>
                    <FormControl
                        placeholder="Search for Projects"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        onChange={onInputChange}
                        bsPrefix={styles.customSearch}
                    />
                    <InputGroup.Append>
                        <Button onClick={search} variant="outline-secondary">Search</Button>
                    </InputGroup.Append>
                </InputGroup>
            </fieldset>
            <div>
                {!isLoggedIn ?
                    <Button type="button" onClick={loginClick}> Login</Button> :
                    <div>
                        <h2> {user.username} </h2>
                        {user.userTags && <TagList tags={user.userTags}/>}
                        <Button type="button" onClick={profileClick}> Profile</Button>
                        <Button type="button" onClick={logoutClick}> Log out</Button>
                        <Button type="button" onClick={createProjectClick}> Create project</Button>
                    </div>}
                <div>
                    <h4>Filter based on category (RADIO BUTTONS? DROPDOWN? )</h4>
                    <Button type="button" onClick={onFilterBasedOnMusicClick}>Music</Button>
                    <Button type="button" onClick={onFilterBasedOnFilmClick}>Film</Button>
                    <Button type="button" onClick={onRemoveFilterClick}>Remove filters</Button>
                </div>
                <MainProjectList content={filteredState} userState={user}/>
                {(pageNr >= 1) && <Button type="button" onClick={onPreviousClick}>PREVIOUS</Button>}
                {(pageNr < totalPages-1) && <Button type="button" onClick={onNextClick}>NEXT</Button>}

            </div>
            <div>

            </div>

        </div>
    );
}

export default Main;


