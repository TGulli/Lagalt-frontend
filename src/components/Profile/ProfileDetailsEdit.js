import {useEffect, useState} from 'react'
import {getUniqueTags} from "../shared/TagsAPI";
import Autosuggest from 'react-autosuggest';
import SkillList from "../shared/SkillList";
import {useDispatch, useSelector} from "react-redux";
import {Card, Container, Button, Form} from "react-bootstrap";
import styles from "./ProfilesDetailsEdit.module.css"
import {useHistory} from "react-router-dom";

function ProfileDetailsEdit({user}) {

    const [uniqueTags, setUniqueTags] = useState([]);
    const [skillList, setSkillList] = useState([])
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [locale, setLocale] = useState('')
    const [ishidden, setIsHidden] = useState(user.hidden)
    const [errorMessage, setErrorMessage] = useState('')
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState(uniqueTags);

    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const history = useHistory();

    const maxStringLengthBio = 1000;
    const maxStringLengthGeneral = 50;
    const limitAddTags = 1000;


    /**
     * The use effect calls on the method getUniqueTags to fetch all
     * the tags from the database. If the get request is successful
     * the uniqueTags is set to the response, if not an error message
     * is shown. The use effect is rendered once.
     * */
    useEffect(() => {
        async function fetchFromApi() {
            let response = await getUniqueTags(token);
            if (!response.message){
                setUniqueTags(response.toString().split(','))
            } else {
                setErrorMessage(response.message)
            }
        }
        fetchFromApi()
    }, []);


    /**
     * This method takes in a value and gets the ten first Unique tags
     * that start with that value
     */
    const getSuggestions = (value) => {
        return uniqueTags.filter(tag => tag.toLowerCase().startsWith(value.trim().toLowerCase())).slice(0, 10)
    }


    /*
    * Function that takes in user input from name input field and sets
    * name to the input
    * */
    const onNameInputChange = e => {
        setName(e.target.value)
    }


    /*
    * Function that takes in user input from userBio input field and sets
    * bio to the input
    * */
    const onBioInputChange = e => {
        setBio(e.target.value)
    }


    /*
    * Function that takes in user input from locale input field and sets
    * locale to the input
    * */
    const onLocaleInputChange = e => {
        setLocale(e.target.value)
    }


    /*
    * Function is called when add skill button is clicked. if the
    * variable value is not an empty string, value is added to the
    * iniqueTags list and the skillList.
    * */
    const onAddSkillClick = () => {
        if (value !== '') {
            setUniqueTags([...skillList, value])
            setSkillList([...skillList, value])
        }
    }


    /*
    * Function that checks that all the input fields have valid inputs.
    * If the input is invalid a message of what is wrong is returned.
    * Otherwise an empty string is returned.
    * */
    const checkInputFields = () => {
        if (name.length > maxStringLengthGeneral){
            return 'Maks ' + {maxStringLengthGeneral} + ' tegn i navn.'
        } else if (locale.length > maxStringLengthGeneral){
            return 'Maks ' + {maxStringLengthGeneral} + ' tegn på sted.'
        } else if (bio.length > maxStringLengthBio){
            return 'Maks ' + {maxStringLengthBio} + ' tegn i biografi.'
        } else if (skillList.length > limitAddTags){
            return 'Maks ' + {limitAddTags} + ' tags.'
        } else {
            return ''
        }
    }


    /*
    * Function that is called when save button is clicked. The function
    * sets the error message to the response of the function checkInputFields.
    * If the error message is not an empty string the method returns.
    * The method then adds all the users tags to a tagArray which will be sent
    * with the user object to the server. If the tags are invalid the method
    * returns. The method sends a put request to the server with the user object.
    * If the request is successful the user is redirected to the main page.
    * If not the user is shown the error that occured.
    * */
    const onSaveClicked = () => {
        setErrorMessage(checkInputFields())
        if (errorMessage !== ''){
            return
        }
        let tagArray = []
        for (let x of skillList){
            if (x.length > maxStringLengthGeneral){
                setErrorMessage("Tags kan ikke ha lengre navn enn " + maxStringLengthGeneral + " tegn.")
                return
            }
            tagArray.push({tag: x})
        }
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token.token},
            body: JSON.stringify({name: name, locale: locale, hidden: ishidden, bio: bio, userTags: tagArray })
        };
        fetch(`https://lagalt-service.herokuapp.com/api/v1/users/${user.id}`, requestOptions).then(r => {
            if (!r){
                setErrorMessage(r.message)
            }
            else {
                history.push("/")
            }
        });
    }


    /*
    * Function that removes the element in a specific index from the
    * skillList.
    * */
    function removeElement(index) {
        let clone = [...skillList]
        clone.splice(index, 1)
        setSkillList(clone);
    }


    /*
   * Function that takes in user input from hidden checkBox and sets
   * isHidden to true if the checkbox is checked.
   * */
    const onPublicChange = e => {
        setIsHidden(e.target.checked)
    }


    return (
        <Container fluid="true">
        <div className={styles.cardContainer}>
            <Card>
                <Card.Header>
                    <h2 className={styles.title}>Rediger profil</h2>
                </Card.Header>
                <Card.Body>
                    <fieldset>
                        <label className={styles.labels} htmlFor="hiddenProfile">
                            Skjult profil
                        </label>
                        <input className={styles.checkbox} id="hiddenProfile" type="checkbox" defaultChecked={ishidden} onChange={onPublicChange} />
                    </fieldset>
                    <fieldset>
                        <label className={styles.labels} htmlFor="nameEdit">Endre navn</label>
                        <input className={styles.inputfield} id="nameEdit" type="text" onChange={onNameInputChange} placeholder={user.name}/>
                    </fieldset>
                    <fieldset>
                        <label className={styles.labels} htmlFor="nameEdit">Endre sted</label>
                        <input className={styles.inputfield} id="nameEdit" type="text" onChange={onLocaleInputChange} placeholder={user.locale}/>
                    </fieldset>
                    <fieldset>
                        <label className={styles.labels} htmlFor="descriptionEdit">Endre biografi</label>
                        <input className={styles.inputfield} id="descriptionEdit" type="text" onChange={onBioInputChange} placeholder={user.bio}/>
                    </fieldset>
                    <Form.Text className="text-muted" style={{float: "right"}}>
                        {bio.length} / 1000
                    </Form.Text>
                    <fieldset>
                        <label className={styles.labels} htmlFor="descriptionEdit">Endre ferdigheter: </label>
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={(e) => {
                                setValue(e.value)
                                setSuggestions(getSuggestions(e.value))
                            }}
                            onSuggestionsClearRequested={() => {}}
                            onSuggestionSelected={(_, { suggestionValue }) =>{
                                setSkillList([...skillList, suggestionValue])
                            }}
                            getSuggestionValue={suggestion => suggestion}
                            renderSuggestion={suggestion => {
                                return <span> {suggestion} </span>
                            }}
                            inputProps={{
                                style: {
                                    padding: '0.5em',
                                    marginBottom: '1em'
                                    },
                                placeholder: "Skriv ferdighet her",
                                value: value,
                                onChange: (_, { newValue }) => {
                                    setValue(newValue);
                                }
                            }}
                            highlightFirstSuggestion={true}
                        />
                        <Button variant="secondary" type="button" onClick={onAddSkillClick}>Legg til ferdighet</Button>
                    </fieldset>
                    <fieldset>
                        {skillList !== undefined && skillList.map((skill, index) =>
                            <SkillList skills={skill} index={index} removeElement={removeElement} />)}
                    </fieldset>
                    <p style={{color: "red"}}>{errorMessage}</p>
                </Card.Body>
                <Button variant="secondary" type="button" onClick={onSaveClicked}>Lagre endringer</Button>
            </Card>


        </div>
        </Container>
    );
}
export default ProfileDetailsEdit;
