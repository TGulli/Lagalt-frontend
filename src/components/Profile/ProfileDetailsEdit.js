import {useEffect, useState} from 'react'
import {getUniqueTags} from "../shared/TagsAPI";
import Autosuggest from 'react-autosuggest';
import SkillList from "../shared/SkillList";
import {useDispatch, useSelector} from "react-redux";
import {Card, Container, Button} from "react-bootstrap";
import styles from "./ProfilesDetailsEdit.module.css"
import {updateUser} from "../../redux/actions";

function ProfileDetailsEdit({user}) {


    const [uniqueTags, setUniqueTags] = useState([]);
    const [skillList, setSkillList] = useState([])
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [locale, setLocale] = useState('')
    const [ishidden, setIsHidden] = useState(user.hidden)

    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchFromApi() {
            let response = await getUniqueTags(token);
            setUniqueTags(response.toString().split(','))
            console.log(response.toString().split(','))
        }
        fetchFromApi()
    }, []);

    // Brukes for auto suggest box
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState(uniqueTags);

    const getSuggestions = (value) => {
        return uniqueTags.filter(tag => tag.toLowerCase().startsWith(value.trim().toLowerCase())).slice(0, 10)
    }

    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onBioInputChange = e => {
        setBio(e.target.value)
    }
    const onLocaleInputChange = e => {
        setLocale(e.target.value)
    }

    const onAddSkillClick = () => {
        if (value !== '') {
            setUniqueTags([...skillList, value])
            setSkillList([...skillList, value])
        }

    }
    const onSaveClicked = async () => {

        let tagArray = []
        for (let x of skillList){
            tagArray.push({tag: x})
        }

        // update redux user

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token.token},
            body: JSON.stringify({name: name, locale: locale, hidden: ishidden, bio: bio, userTags: tagArray })
        };
        fetch(`http://localhost:8080/api/v1/users/${user.id}`, requestOptions).then(r => console.log(r));

    }

    
    function removeElement(index) {
        let clone = [...skillList]
        clone.splice(index, 1)
        setSkillList(clone);
    }

    const onPublicChange = e => {

        setIsHidden(e.target.checked)
        console.log(e.target.checked)


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
                </Card.Body>
                <Button variant="secondary" type="button" onClick={onSaveClicked}>Lagre endringer</Button>
            </Card>


        </div>
        </Container>
    );


}

export default ProfileDetailsEdit;
