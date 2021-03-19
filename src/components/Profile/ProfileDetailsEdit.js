import {useHistory} from "react-router-dom";
import {useEffect, useState} from 'react'
import {getUniqueTags} from "./ProfileEditAPI";
import Autosuggest from 'react-autosuggest';
import SkillList from "../shared/SkillList";

function ProfileDetailsEdit({user}) {


    const [uniqueTags, setUniqueTags] = useState([]);
    const [skillList, setSkillList] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        async function fetchFromApi() {
            let response = await getUniqueTags();
            setUniqueTags(response.toString().split(','))
            console.log(response.toString().split(','))
        }
        fetchFromApi()
    }, []);

    // Brukes for auto suggest box
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState(uniqueTags);

    const getSuggestions = (value) => {
        let count = 0;
        return uniqueTags.filter((element) => {
            return element.toLowerCase().startsWith(value.trim().toLowerCase()) && count++ < 10
        });
    }

    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onDescriptionInputChange = e => {
        setDescription(e.target.value)
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

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, description: description, userTags: tagArray })
        };
        fetch(`http://localhost:8080/api/v1/users/${user.id}`, requestOptions).then(r => console.log(r));
    }
    
    function removeElement(index) {
        let clone = [...skillList]
        clone.splice(index, 1)
        setSkillList(clone);
    }



    return (
        <div>
            <fieldset>
                <label htmlFor="nameEdit">Edit name</label>
                <input id="nameEdit" type="text" onChange={onNameInputChange} placeholder={user.name}/>
            </fieldset>
            <fieldset>
                <label htmlFor="descriptionEdit">Edit description</label>
                <input id="descriptionEdit" type="text" onChange={onDescriptionInputChange} placeholder={user.description}/>
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

export default ProfileDetailsEdit;
