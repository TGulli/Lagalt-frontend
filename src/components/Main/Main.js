import MainProjectList from "./MainProjectList";
import {useHistory} from "react-router-dom";
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {logOut, updateUser} from "../../redux/actions";
import {fetchData} from "./MainAPI";
import TagList from "../shared/TagList";
import {Button, InputGroup, FormControl, Dropdown} from "react-bootstrap";
import styles from './Main.module.css'
import {ButtonGroup} from "react-bootstrap";


function Main() {

    /**
     * TODO: MIDDLEWARE TO SOLVE PAGINATION PROBLEM
     * TODO: useEffect renders only once when given empty array as second argument
     */

    const user = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const history = useHistory();
    const dispatch = useDispatch()

    const [projectsState, setProjectsState] = useState([{}])
    const [filteredState, setFilteredState] = useState([{}])
    const [tempText, setTempText] = useState('Velg kategori')

    // Might refactor
    const [totalPages, setTotalPages] = useState(0);
    const [pageNr, setPageNr] = useState(0);
    const [searchState, setSearchState] = useState('')

    console.log('MAIN USER:' + JSON.stringify(user))
    console.log('MAIN TOKEN:' + JSON.stringify(token))

    useEffect(() => {
        async function fetchFromApi() {
            let response = await fetchData(pageNr);
            console.log(response);
            setTotalPages(response.totalPages)
            setProjectsState(response.content)
            setFilteredState(response.content)
            console.log(response)
        }
        fetchFromApi()
        if (isLoggedIn){
            dispatch(updateUser(user.id, token))
        }
    }, []);

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
        setTempText('Musikk')
        setFilteredState(projectsState.filter(x => x.category === 'Musikk'));
    }

    const onFilterBasedOnFilmClick = () => {
        setTempText('Film')
        setFilteredState(projectsState.filter(x => x.category === 'Film'));
    }

    const onRemoveFilterClick = () => {
        setTempText('Alle')
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
            <div className={styles.container}>
                <fieldset>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Skriv inn navn på prosjekt.."
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={onInputChange}
                            bsPrefix={styles.customSearch}
                        />
                        <InputGroup.Append>
                            <Button onClick={search} variant="primary">Søk etter prosjekt!</Button>
                        </InputGroup.Append>
                        <InputGroup.Append>
                            <Dropdown as={ButtonGroup}>
                                <Button variant="outline-dark">{tempText}</Button>
                                <Dropdown.Toggle split variant="outline-dark" id="dropdown-split-basic"/>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={onRemoveFilterClick}>Alle</Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterBasedOnFilmClick}>Film</Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterBasedOnMusicClick}>Musikk</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </InputGroup.Append>
                    </InputGroup>
                </fieldset>
                {isLoggedIn &&
                <div>
                    <Button type="button" variant="primary" size="lg" onClick={createProjectClick}>Opprett nytt prosjekt</Button>
                </div>}
            </div>
            <div>

                <MainProjectList content={filteredState} userState={user}/>
                {(pageNr >= 1) && <Button type="button" onClick={onPreviousClick}>PREVIOUS</Button>}
                {(pageNr < totalPages - 1) && <Button type="button" onClick={onNextClick}>NEXT</Button>}

            </div>
            <div>

            </div>

        </div>
    );
}

export default Main;


