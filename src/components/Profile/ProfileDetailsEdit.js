import {useHistory} from "react-router-dom";
import {useState} from 'react'
import Autosuggest from 'react-autosuggest';




function ProfileDetailsEdit({user}) {


    const history = useHistory()

    const tags = [
        "C#",
        "C++",
        "Java",
        ".NET",
        "C",
        "JavaScript",
        "Notepad++",
        "Node.js",
    ];

    // Brukes for auto suggest box
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState(tags);

    // Add skill, vis som "liste"
    const [skill, addSkill] = useState('');

    const getSuggestions = (value) => {
        //setTimeOut -> gjør databasesøk.
        return tags.filter(element => {
            return element.toLowerCase().includes(value.trim().toLowerCase())
        });
    }

    const onNameInputChange = () => {

    }
    const onDescriptionInputChange = () => {

    }

    const onAddSkillClick = () => {

    }
    const onSaveClicked = () => {

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
                <label htmlFor="descriptionEdit">Change image</label>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={(e) => {
                        setValue(e.value)
                        setSuggestions(getSuggestions(e.value))
                    }}
                    onSuggestionsClearRequested={() => {
                        console.log('CLEAR || NONFOCUS')
                    }}
                    onSuggestionSelected={(_, { suggestionValue }) =>
                        // Her legg e te i "skills" lista
                        console.log("Selected: " + suggestionValue)
                    }
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
                <button type="button" onClick={onAddSkillClick}>Add skill!</button>
            </fieldset>
            <button type="button" onClick={onSaveClicked}>Save changes</button>

        </div>
    );


}

export default ProfileDetailsEdit;
