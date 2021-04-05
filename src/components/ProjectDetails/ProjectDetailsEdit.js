import React, {useState, useEffect} from 'react'
import {getUniqueTags} from "../shared/TagsAPI";
import Autosuggest from "react-autosuggest";
import SkillList from "../shared/SkillList";
import {useSelector} from "react-redux";
import styles from "./ProjectDetailsEdit.module.css"
import {Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";



function ProjectDetailsEdit({project, setEditMode}) {

    //Global state token
    const token = useSelector(state => state.token);

    //States
    const [progress, setProgress] = useState(0)
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [image, setImage] = useState("")
    const [errorMessage, setErrorMessage] = useState('')

    //History for redirecting
    const history = useHistory()


    //********************** AUTO SUGGEST LOGIC START ******************************
    const [uniqueTags, setUniqueTags] = useState([]);
    const [skillList, setSkillList] = useState([])

    /**
     * Fetches tags from the API for auto suggestion functionality.
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

    const [tagValue, setTagValue] = useState('');
    const [suggestions, setSuggestions] = useState(uniqueTags);


    /**
     * Gets tags suggestions based on the letters provided by the user in the input field
     * */
    const getSuggestions = (value) => {
        return uniqueTags.filter(tag => tag.toLowerCase().startsWith(value.trim().toLowerCase())).slice(0, 5)
    }

    /**
     * When the user adds a new skill it is added to the tags and skill list
     * */
    const onAddSkillClick = () => {
        if (tagValue !== '') {
            setUniqueTags([...skillList, tagValue])
            setSkillList([...skillList, tagValue])
        }
        setTagValue('')
    }

    /**
     * If the user removes a skill, it is removed from the skill list
     * */
    function removeElement(index) {
        let clone = [...skillList]
        clone.splice(index, 1)
        setSkillList(clone);
    }

    //********************** AUTO SUGGEST LOGIC END ******************************

    /**
     * Set the input value for description.
     * */
    const onDescriptionInputChange = e => {
        setDescription(e.target.value)
    }

    /**
     * Set the input value for category.
     * */
    const onCategoryInputChange = e => {
        setCategory(e.target.value)
    }

    /**
     * Set the input value for image.
     * */
    const onImageInputChange = e => {
        setImage(e.target.value)
    }

    /**
     * Set the input value for progress.
     * */
    const handleSelectChange = e => {
        setProgress(parseInt(e.target.value))
    }

    /**
     * If the user clicks delete project, a delete request is sent to the API.
     * The user is redirected to the main page.
     * If the request returns an error, the error is displayed to the user.
     * */
    const onDeleteClick = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)}
        };
        fetch(`https://lagalt-service.herokuapp.com/api/v1/projects/${project.id}`, requestOptions)
            .then(r => r.json())
            .then((jwtToken) => { setErrorMessage(jwtToken.message)});
        history.push("/")
    }

    /**
     * If the user discard the changes, the editMode is set to false, and the project details is displayed.
     * */
    const onBackClick = () => {
        setEditMode(false)
    }

    /**
     * When the user clicks save the skill list is added to a list of tag objects and
     * a put request with the project is sent to the API.
     * The edit mode is set to false.
     * */
    const onSaveClicked = () => {

        let tagArray = []
        for (let x of skillList){
            tagArray.push({tag: x})
        }

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
            body: JSON.stringify({description: description, category: category, image: image, progress: progress, projectTags: tagArray} )
        };
        fetch(`https://lagalt-service.herokuapp.com/api/v1/projects/${project.id}`, requestOptions).then(r => {if (!r) setErrorMessage(r.message)});
        setEditMode(false)
    }

    return (
        <div className={styles.editWrapper} style={{textAlign: "left"}}>
            <h3 style={{textAlign: "center"}}>Rediger</h3>
            <br/>
            <fieldset>
                <label className={styles.labels} htmlFor="progressEdit">Endre progresjon</label>
                <select className={styles.inputfield} name="progressEdit" onChange={e => handleSelectChange(e)}>
                    <option value="0">Oppstart</option>
                    <option value="1">Under arbeid</option>
                    <option value="2">Stoppet</option>
                    <option value="3">Ferdig</option>
                </select>
            </fieldset>
            <fieldset>
                <label className={styles.labels} htmlFor="descriptionEdit">Endre beskrivelse</label>
                <input className={styles.inputfield} id="descriptionEdit" type="text" onChange={onDescriptionInputChange} placeholder={project.description}/>
            </fieldset>
            <fieldset>
                <label className={styles.labels} htmlFor="progressEdit">Velg kategori</label>
                <select className={styles.inputfield} name="progressEdit" onChange={e => onCategoryInputChange(e)}>
                    <option value="Musikk">Musikk</option>
                    <option value="Film">Film</option>
                    <option value="Spill Utvikling">Spill Utvikling</option>
                    <option value="Web Utvikling">Web Utvikling</option>
                </select>
            </fieldset>
            <fieldset>
                <label className={styles.labels} htmlFor="descriptionEdit">Endre bilde</label>
                <input className={styles.inputfield} id="descriptionEdit" type="text" onChange={onImageInputChange} placeholder={project.image}/>
            </fieldset>
            <fieldset>
                <label className={styles.labels} htmlFor="descriptionEdit">Finn kvalifikasjoner</label>
                <div style={{display: "inline", width: "60%"}}>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={(e) => {
                            setTagValue(e.value)
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
                            placeholder: "Skriv inn ny kvalifikasjon",
                            value: tagValue,
                            onChange: (_, { newValue }) => {
                                setTagValue(newValue);
                            }
                        }}
                        highlightFirstSuggestion={true}
                    />
                </div>
                <Button style={{display: "inline", float: "right"}} type="button" variant="success" onClick={onAddSkillClick}>Legg til ny kvalifikasjon</Button>
                <br/>
                <br/>
                <h6>Nye kvalifikasjoner</h6>
            </fieldset>
            <fieldset style={{textAlign: "left"}}>
                {skillList !== undefined && skillList.map((skill, index) =>
                    <SkillList skills={skill} index={index} removeFunction={removeElement} />)}
            </fieldset>
            <br/>
            <p style={{color: "red"}}>{errorMessage}</p>
            <div className={styles.leftButton}><Button variant="success" type="button" onClick={onSaveClicked}>Lagre endringer</Button></div>
            <div className={styles.rightButton}><Button variant="danger" type="button" onClick={onDeleteClick}>Slett prosjekt</Button></div>
            <Button type="button" onClick={onBackClick}>Forkast endringer</Button>
        </div>
    );
}

export default ProjectDetailsEdit;


