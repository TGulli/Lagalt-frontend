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
    const [filterText, setFilterText] = useState("Velg kategori")
    const [errorMessage, setErrorMessage] = useState('')

    // Might refactor
    const [totalPages, setTotalPages] = useState(0);
    const [pageNr, setPageNr] = useState(0);
    const [searchState, setSearchState] = useState('')

    console.log('MAIN USER:' + JSON.stringify(user))
    console.log('MAIN TOKEN:' + JSON.stringify(token))

    useEffect(() => {
        fetchAllFromApi(0)
        if (isLoggedIn){
            dispatch(updateUser(user.id, token))
        }
    }, []);

    const fetchAllFromApi = async (pageNumber) => {
        let response = await fetchData(pageNumber);
        if (!response.message){
            console.log(response);
            setTotalPages(response.totalPages)
            setProjectsState(response.content)
            console.log(response)
        } else{
            setErrorMessage(response.message)
        }
    }

    const createProjectClick = () => {
        history.push("/project/create")
    }

    const search = async () => {
        await fetchFromApi(0, filterText)
    }

    const fetchFromApi = async (pageNumber, filterText) => {
        console.log("search: " + searchState)
        console.log("filterText: " + filterText)
        if (searchState === '' && (filterText === "Alle" || filterText === "Velg kategori")){
            await fetchAllFromApi(pageNumber)
        } else if (searchState !== '' && (filterText === "Alle" || filterText === "Velg kategori")){
            await fetch(`http://localhost:8080/api/v1/public/projects/search/${searchState}/p/${pageNumber}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    if (!jsonResponse.message){
                        setTotalPages(jsonResponse.totalPages)
                        setProjectsState(jsonResponse.content)
                    } else{
                        setErrorMessage(jsonResponse.message)
                    }
                })
        } else if (searchState === '' ){
            await fetch(`http://localhost:8080/api/v1/public/projects/filter/${filterText}/p/${pageNumber}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    if (!jsonResponse.message){
                        setTotalPages(jsonResponse.totalPages)
                        setProjectsState(jsonResponse.content)
                    } else{
                        setErrorMessage(jsonResponse.message)
                    }
                })
        } else {
            await fetch(`http://localhost:8080/api/v1/public/projects/search/${searchState}/filter/${filterText}/p/${pageNumber}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    if (!jsonResponse.message){
                        setTotalPages(jsonResponse.totalPages)
                        setProjectsState(jsonResponse.content)
                    } else{
                        setErrorMessage(jsonResponse.message)
                    }
                })
        }
        setPageNr(pageNumber)
        setFilterText(filterText)
    }

    const onInputChange = e => {
        setSearchState(e.target.value)
    }

    const onFilterBasedOnGameDevClick = async () => {
        await fetchFromApi(pageNr, "Spill Utvikling")
    }

    const onFilterBasedOnWebDevClick= async () => {
        await fetchFromApi(pageNr, "Web Utvikling")
    }

    const onFilterBasedOnMusicClick = async () => {
        await fetchFromApi(pageNr, "Musikk")
    }

    const onFilterBasedOnFilmClick = async () => {
        await fetchFromApi(pageNr, "Film")
    }

    const onRemoveFilterClick = async () => {
        await fetchFromApi(pageNr, "Alle")
    }

    const onNextClick = async () => {
        console.log("pageNr " + pageNr)
        if (pageNr < totalPages - 1) {
            await fetchFromApi(pageNr + 1, filterText);
        }
    }

    const onPreviousClick = async () => {
        console.log("pageNr " + pageNr)
        if (pageNr > 0) {
            await fetchFromApi(pageNr - 1, filterText);
        }
    }

    return (
        <div>
            <div className={styles.container}>
                <p style={{color: "red"}}>{errorMessage}</p>
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
                                <Button variant="outline-dark">{filterText}</Button>
                                <Dropdown.Toggle split variant="outline-dark" id="dropdown-split-basic"/>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={onRemoveFilterClick}>Alle</Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterBasedOnFilmClick}>Film</Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterBasedOnMusicClick}>Musikk</Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterBasedOnGameDevClick}>Spill Utvikling</Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterBasedOnWebDevClick}>Web Utvikling</Dropdown.Item>
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
                <MainProjectList content={projectsState} userState={user}/>
                {(pageNr >= 1) && <Button type="button" onClick={onPreviousClick}>PREVIOUS</Button>}
                {(pageNr < totalPages - 1) && <Button type="button" onClick={onNextClick}>NEXT</Button>}

            </div>
        </div>
    );
}

export default Main;


