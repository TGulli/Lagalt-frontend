import MainProjectList from "./MainProjectList";
import {useHistory} from "react-router-dom";
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {logOut, updateUser} from "../../redux/actions";
import {fetchData, fetchLoginData} from "./MainAPI";
import TagList from "../shared/TagList";
import {Button, InputGroup, FormControl, Dropdown} from "react-bootstrap";
import styles from './Main.module.css'
import {ButtonGroup} from "react-bootstrap";


function Main() {

    const user = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const history = useHistory();
    const dispatch = useDispatch()

    const [projectsState, setProjectsState] = useState([{}])
    const [filterText, setFilterText] = useState("Velg kategori")
    const [errorMessage, setErrorMessage] = useState('')

    const [totalPages, setTotalPages] = useState(0);
    const [pageNr, setPageNr] = useState(0);
    const [searchState, setSearchState] = useState('')


    /*
     * In the use effect we call on the method FetchAllFromAPI to fetch all
     * the projects to be shown on the first page. The global-state user is
     * also updated. This use effect is rendered once.
     * */
    useEffect(() => {
        fetchAllFromApi(0)
        if (isLoggedIn){
            dispatch(updateUser(user.id, token))
        }
    }, []);


    /*
    * This async function takes in the pageNumber and fetches the projects
    * to be shown on that page. It calls on either fetchLoginData or
    * fetchData from MainAPI.js depending if the user is logged in or not.
    * If the fetch request is successful we set the totalPages and projectState
    * to the response values. If not we show the error that occured.
    * */
    const fetchAllFromApi = async (pageNr) => {
        let response = isLoggedIn? await fetchLoginData(pageNr, token) : await fetchData(pageNr)
        if (!response.message){
            setTotalPages(response.totalPages)
            setProjectsState(response.content)
        } else{
            setErrorMessage(response.message)
        }
    }


    /*
    * This function is called when the create project button is clicked.
    * The function redirects the user to the create project page.
    * */
    const createProjectClick = () => {
        history.push("/project/create")
    }


   /*
    * This function is called when the search button is clicked.
    * The function calls on the functuion fetchByApi which fetches
    * the projects matching the search criteria(filterText).
    * */
    const search = async () => {
        await fetchFromApi(0, filterText)
    }


    /* *
     * This async function fetches the projects based on page and search/filter
     * criteria. Since the function is quite long it is explained more
     * detailed with comments inside the code.
     */
    const fetchFromApi = async (pageNumber, filterText) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token.token
            }
        }
        //If the user hasn't set a search criteria or the filter is set to all or choose category
        if (searchState === '' && (filterText === "Alle" || filterText === "Velg kategori")){
            //we fetch all projects based on pagenumber
            await fetchAllFromApi(pageNumber)
        //If we have set a search criteria
        } else if (searchState !== '' && (filterText === "Alle" || filterText === "Velg kategori")){
            //and the user is logged in we fetch all projects based on search criteria and page.
            isLoggedIn?
                await fetch(`https://lagalt-service.herokuapp.com/api/v1/projects/search/${searchState}/p/${pageNumber}`, requestOptions)
                    .then(response => response.json())
                    .then((jsonResponse) => {
                        if (!jsonResponse.message){
                            setTotalPages(jsonResponse.totalPages)
                            setProjectsState(jsonResponse.content)
                        } else{
                            setErrorMessage(jsonResponse.message)
                        }
                    })
                : //and if the user is not logged in we do the same but we fetch from a public endpoint
                await fetch(`https://lagalt-service.herokuapp.com/api/v1/public/projects/search/${searchState}/p/${pageNumber}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    if (!jsonResponse.message){
                        setTotalPages(jsonResponse.totalPages)
                        setProjectsState(jsonResponse.content)
                    } else{
                        setErrorMessage(jsonResponse.message)
                    }
                })
        //if the user hasn't set a search criteria
        } else if (searchState === '' ){
            //and the user is logged in we fetch all projects based on the filter and the page.
            isLoggedIn?
                await fetch(`https://lagalt-service.herokuapp.com/api/v1/projects/filter/${filterText}/p/${pageNumber}`, requestOptions)
                    .then(response => response.json())
                    .then((jsonResponse) => {
                        if (!jsonResponse.message){
                            setTotalPages(jsonResponse.totalPages)
                            setProjectsState(jsonResponse.content)
                        } else{
                            setErrorMessage(jsonResponse.message)
                        }
                    })
                : //and if the user is not logged in we fetch all projects based on the filter and the page from a public endpoint.
                await fetch(`https://lagalt-service.herokuapp.com/api/v1/public/projects/filter/${filterText}/p/${pageNumber}`)
                .then(response => response.json())
                .then((jsonResponse) => {
                    if (!jsonResponse.message){
                        setTotalPages(jsonResponse.totalPages)
                        setProjectsState(jsonResponse.content)
                    } else{
                        setErrorMessage(jsonResponse.message)
                    }
                })
        //if the user has set a search criteria and a filter
        } else
            //if the user is logged in we fetch the projects based on both search criteria and the filter
            isLoggedIn?
                await fetch(`https://lagalt-service.herokuapp.com/api/v1/projects/search/${searchState}/filter/${filterText}/p/${pageNumber}`, requestOptions)
                    .then(response => response.json())
                    .then((jsonResponse) => {
                        if (!jsonResponse.message){
                            setTotalPages(jsonResponse.totalPages)
                            setProjectsState(jsonResponse.content)
                        } else{
                            setErrorMessage(jsonResponse.message)
                        }
                    })
                : //if the user is not logged in we fetch the projects based on both search criteria and the filter from a public endpoint
                await fetch(`https://lagalt-service.herokuapp.com/api/v1/public/projects/search/${searchState}/filter/${filterText}/p/${pageNumber}`)
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


    /**
     * Function that takes in user input from search input field and sets
     * searchState to the input
     */
    const onInputChange = e => {
        setSearchState(e.target.value)
    }

    /**
     * Function that is called when users sets filter to game-development.
     * The function calls on method fetchFromApi with the page and
     * "spill utvikling" as parameters.
     */
    const onFilterBasedOnGameDevClick = async () => {
        await fetchFromApi(pageNr, "Spill Utvikling")
    }


    /**
     * Function that is called when users sets filter to Web development.
     * The function calls on method fetchFromApi with the page and
     * "Web utvikling" as parameters.
     */
    const onFilterBasedOnWebDevClick= async () => {
        await fetchFromApi(pageNr, "Web Utvikling")
    }


    /**
     * Function that is called when users sets filter to music.
     * The function calls on method fetchFromApi with the page and
     * "Music" as parameters.
     */
    const onFilterBasedOnMusicClick = async () => {
        await fetchFromApi(pageNr, "Musikk")
    }


    /**
     * Function that is called when users sets filter to film.
     * The function calls on method fetchFromApi with the page and
     * "Film" as parameters.
     */
    const onFilterBasedOnFilmClick = async () => {
        await fetchFromApi(pageNr, "Film")
    }

    /**
     * Function that is called when users sets filter to all.
     * The function calls on method fetchFromApi with the page and
     * "Alle" as parameters.
     */
    const onRemoveFilterClick = async () => {
        await fetchFromApi(pageNr, "Alle")
    }


    /**
     * Function that is called when users clicks next page button.
     * The function calls on method fetchFromApi with the page and
     * current filterText as parameters.
     */
    const onNextClick = async () => {
        if (pageNr < totalPages - 1) {
            await fetchFromApi(pageNr + 1, filterText);
        }
    }


    /**
     * Function that is called when users clicks previous page button.
     * The function calls on method fetchFromApi with the page and
     * current filterText as parameters.
     */
    const onPreviousClick = async () => {
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


