import React, {useState, useEffect} from 'react'
import {getUniqueTags} from "../shared/TagsAPI";
import Autosuggest from "react-autosuggest";
import SkillList from "../shared/SkillList";
import {useSelector} from "react-redux";
import styles from "./ProjectDetailsEdit.module.css"
import {Button, Card} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import TagList from "../shared/TagList";

/**
 * TODO: INPUT VALIDATION
 */


function ProjectDetailsEdit({project, setEditMode}) {

    
    const user = useSelector(state => state.user)
    const [name, setName] = useState(project.name)
    const [progress, setProgress] = useState(project.progress)
    const [description, setDescription] = useState(project.description)
    const [category, setCategory] = useState(project.category)
    const [image, setImage] = useState(project.image)

    const token = useSelector(state => state.token);
    const history = useHistory()


    //********************** AUTO SUGGEST LOGIC START ******************************
    const [uniqueTags, setUniqueTags] = useState([]);
    const [skillList, setSkillList] = useState([])

    useEffect(() => {
        async function fetchFromApi() {
            let response = await getUniqueTags(token);
            setUniqueTags(response.toString().split(','))
            console.log(response.toString().split(','))
        }
        fetchFromApi()
    }, []);

    const [tagValue, setTagValue] = useState('');
    const [suggestions, setSuggestions] = useState(uniqueTags);

    const getSuggestions = (value) => {
        return uniqueTags.filter(tag => tag.toLowerCase().startsWith(value.trim().toLowerCase())).slice(0, 5)
    }

    const onAddSkillClick = () => {
        if (tagValue !== '') {
            setUniqueTags([...skillList, tagValue])
            setSkillList([...skillList, tagValue])
        }
        setTagValue('')
    }

    function removeElement(index) {
        let clone = [...skillList]
        clone.splice(index, 1)
        setSkillList(clone);
    }

    //********************** AUTO SUGGEST LOGIC END ******************************

    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onDescriptionInputChange = e => {
        setDescription(e.target.value)
    }

    const onCategoryInputChange = e => {
        setCategory(e.target.value)
    }

    const onImageInputChange = e => {
        setImage(e.target.value)
    }

    const handleSelectChange = e => {
        setProgress(parseInt(e.target.value))
    }

    const onDeleteClick = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        };
        fetch(`http://localhost:8080/api/v1/projects/${project.id}`, requestOptions).then(r => console.log(r));
        history.push("/")
    }

    const onBackClick = () => {
        setEditMode(false)
    }


    const onSaveClicked = () => {
        const ownerArray = [];
        for (let x of project.owners){
            ownerArray.push({id: x.id})
        }

        let tagArray = []
        for (let x of skillList){
            tagArray.push({tag: x})
        }

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
            body: JSON.stringify({user: {id: user.id}, project: ({id: project.id, name: name, description: description, category: category, progress: progress, image: image, projectTags: tagArray, owners: ownerArray })})
        };
        fetch(`http://localhost:8080/api/v1/projects/${project.id}`, requestOptions).then(r => console.log(r));
        setEditMode(false)
    }

    return (
        <div style={{textAlign: "left"}}>
            <h3 style={{textAlign: "center"}}>Rediger</h3>
            <br/>
            <fieldset>
                <label className={styles.labels} htmlFor="nameEdit">Endre navn</label>
                <input className={styles.inputfield} id="nameEdit" type="text" onChange={onNameInputChange} placeholder={project.name}/>
            </fieldset>
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
                <label className={styles.labels} htmlFor="descriptionEdit">Sett kategori</label>
                <input className={styles.inputfield} id="descriptionEdit" type="text" onChange={onCategoryInputChange} placeholder={project.description}/>
            </fieldset>
            <fieldset>
                <label className={styles.labels} htmlFor="descriptionEdit">Endre bilde</label>
                <input className={styles.inputfield} id="descriptionEdit" type="text" onChange={onImageInputChange} placeholder={project.image}/>
            </fieldset>
            <fieldset>
                <label className={styles.labels} htmlFor="descriptionEdit">Finn kvalifikasjoner</label>
                <div style={{float: "right", width: "60%"}}>
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

                <br/>
                <Button style={{float: "right"}} type="button" variant="success" onClick={onAddSkillClick}>Legg til ny kvalifikasjon</Button>
                <br/>
                <br/>
                <h6>Nye kvalifikasjoner</h6>
            </fieldset>
            <fieldset style={{textAlign: "left"}}>
                {skillList !== undefined && skillList.map((skill, index) =>
                    <SkillList skills={skill} index={index} removeFunction={removeElement} />)}
            </fieldset>
            <br/>
            <div className={styles.leftButton}><Button variant="success" type="button" onClick={onSaveClicked}>Lagre endringer</Button></div>
            <div className={styles.rightButton}><Button variant="danger" type="button" onClick={onDeleteClick}>Slett prosjekt</Button></div>
            <Button type="button" onClick={onBackClick}>Forkast endringer</Button>
        </div>
    );
}

export default ProjectDetailsEdit;


