import {useState, useEffect} from 'react'
import {getUniqueTags} from "../shared/TagsAPI";
import Autosuggest from "react-autosuggest";
import SkillList from "../shared/SkillList";

/**
 * TODO: INPUT VALIDATION
 */


function ProjectDetailsEdit({project}) {

    

    const [name, setName] = useState('')
    const [progress, setProgress] = useState(0)
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')

    //********************** AUTO SUGGEST LOGIC START ******************************
    const [uniqueTags, setUniqueTags] = useState([]);
    const [skillList, setSkillList] = useState([])

    useEffect(() => {
        async function fetchFromApi() {
            let response = await getUniqueTags();
            setUniqueTags(response.toString().split(','))
            console.log(response.toString().split(','))
        }
        fetchFromApi()
    }, []);

    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState(uniqueTags);

    const getSuggestions = (value) => {
        return uniqueTags.filter(tag => tag.toLowerCase().startsWith(value.trim().toLowerCase())).slice(0, 5)
    }

    const onAddSkillClick = () => {
        if (value !== '') {
            setUniqueTags([...skillList, value])
            setSkillList([...skillList, value])
        }

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

    const onImageInputChange = e => {
        setImage(e.target.value)
    }

    const handleSelectChange = e => {
        setProgress(parseInt(e.target.value))
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, description: description, progress: progress, image: image, projectTags: tagArray, owners: ownerArray })
        };
        fetch(`http://localhost:8080/api/v1/projects/${project.id}`, requestOptions).then(r => console.log(r));
    }

    return (
        <div>
            <fieldset>
                <label htmlFor="nameEdit">Edit name</label>
                <input id="nameEdit" type="text" onChange={onNameInputChange} placeholder={project.name}/>
            </fieldset>
            <fieldset>
                <label htmlFor="progressEdit">Edit progress</label>
                <select name="progressEdit" onChange={e => handleSelectChange(e)}>
                    <option value="0">Founding</option>
                    <option value="1">In progress</option>
                    <option value="2">Stalled</option>
                    <option value="3">Completed</option>
                </select>
            </fieldset>
            <fieldset>
                <label htmlFor="descriptionEdit">Edit description</label>
                <input id="descriptionEdit" type="text" onChange={onDescriptionInputChange} placeholder={project.description}/>
            </fieldset>
            <fieldset>
                <label htmlFor="descriptionEdit">Change image</label>
                <input id="descriptionEdit" type="text" onChange={onImageInputChange} placeholder={project.image}/>
            </fieldset>
            <fieldset>
                <label htmlFor="descriptionEdit">Find skills</label>
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
                        placeholder: "Type 'c'",
                        value: value,
                        onChange: (_, { newValue }) => {
                            setValue(newValue);
                        }
                    }}
                    highlightFirstSuggestion={true}
                />
                <button type="button" onClick={onAddSkillClick}>Add new skill</button>
            </fieldset>
            <fieldset>
                {skillList !== undefined && skillList.map((skill, index) =>
                    <SkillList skills={skill} index={index} removeElement={removeElement} />)}
            </fieldset>
            <button type="button" onClick={onSaveClicked}>Save changes</button>
        </div>
    );
}

export default ProjectDetailsEdit;


