import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux";
import {updateUser} from "../../redux/actions";
import {useHistory} from "react-router-dom";
import "./CreateProjec.css"
import {Form, Button} from "react-bootstrap";
import {getUniqueTags} from "../shared/TagsAPI";
import Autosuggest from "react-autosuggest";
import SkillList from "../shared/SkillList";

function CreateProject() {

    const history = useHistory();

    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch()

    /**
     * Set the initial values of the values in the form
     * */
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('Musikk')
    const [uniqueTags, setUniqueTags] = useState([])
    const [skillList, setSkillList] = useState([])
    // Brukes for auto suggest box
    const [value, setValue] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [suggestions, setSuggestions] = useState(uniqueTags)


    /**
     * On loading the unique tags are fetched from the API,
     * and added to an array which are used to display suggestions of skilles to the user.
     * */
    useEffect(() => {
        async function fetchFromApi() {
            let response = await getUniqueTags(token);
            if (token.message){
                setErrorMessage(token.message)
            } else{
                setUniqueTags(response.toString().split(','))
            }
        }
        fetchFromApi()
    }, []);

    /**
     * Set the input value for name
     * */
    const onNameInputChange = e => {
        setName(e.target.value)
    }

    /**
     * Set the input value for category.
     * */
    const onCategoryInputChange = e => {
        console.log(e.target.value)
        setCategory(e.target.value)
    }

    /**
     * Set the input value for progress.
     * */
    const onProgressInputChange = e => {
        setProgress(e.target.value)
    }

    /**
     * Set the input value for description.
     * */
    const onDescriptionInputChange = e => {
        setDescription(e.target.value)
    }

    /**
     * Get suggestions for skills based on the letters provided by the user.
     * */
    const getSuggestions = (value) => {
        return uniqueTags.filter(tag => tag.toLowerCase().startsWith(value.trim().toLowerCase())).slice(0, 10)
    }

    /**
     *  Adds the skill provided by the user to the tags and skill list.
     * */
    const onAddSkillClick = () => {
        if (value !== '') {
            setUniqueTags([...skillList, value])
            setSkillList([...skillList, value])
        }
    }

    /**
     * Removes a skill from the skill list.
     * */
    function removeElement(index) {
        let clone = [...skillList]
        clone.splice(index, 1)
        setSkillList(clone);
    }

    /**
     * Set the input value for image.
     * */
    const onImageInputChange = e => {
        setImage(e.target.value)
    }

    /**
     * Posts the values of the form to the API when the user clicks save.
     * If the post returns an error message, the message is displayed to the user.
     * If the post returns created, the user is redirected to the main page.
     * */
    const onButtonClick = async () => {

        let tagArray = []
        for (let tag of skillList){
            tagArray.push({tag: tag})
        }
        console.log("tagarray")
        console.log(tagArray)
        console.log("skillist")
        console.log(skillList)

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + token.token)},
            body: JSON.stringify({name: name, description: description, progress: progress, image: image, category: category, projectTags: tagArray, owner: { id: user.id }})
        };
        await fetch('https://lagalt-service.herokuapp.com/api/v1/projects', requestOptions).then(response => response.json())
            .then((data) => {
                if (!data.message){
                    history.push("/")
                }
                else {
                    setErrorMessage(data.message)
                }
            }
        );
    }



    return (
        <div className="App">
            <Form className="form-cp">
                <h1 className="h1-cp">Opprett et prosjekt</h1>
                <Form.Group className="form-group-cp" controlId="projectName">
                    <Form.Label className="form-label-cp">Prosjekt tittel *</Form.Label>
                    <Form.Control className="form-control-cp"
                                  type="text"
                                  placeholder="Skriv inn prosjekt tittel"
                                  onChange={onNameInputChange}
                    />
                </Form.Group>

                <Form.Group className="form-group-cp" controlId="projectCategory">
                    <Form.Label className="form-label-cp">Velg kategori *</Form.Label>
                    <Form.Control  className="form-control-cp"
                                   as="select"
                                   onChange={onCategoryInputChange}>
                        <option value="Musikk">Musikk</option>
                        <option value="Film">Film</option>
                        <option value="Spill Utvikling">Spill Utvikling</option>
                        <option value="Web Utvikling">Web Utvikling</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="form-group-cp" controlId="projectProgress">
                    <Form.Label className="form-label-cp">Velg prosjektets progresjons-status *</Form.Label>
                    <Form.Control  className="form-control-cp"
                                   as="select"
                                   onChange={onProgressInputChange}>
                        <option value="0">Oppstart</option>
                        <option value="1">Under arbeid</option>
                        <option value="2">Stoppet</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="form-group-cp" controlId="projectTags">
                    <Form.Label className="form-label-cp">Velg tags som reflekterer ferdighetene som må til for å delta i prosjektet</Form.Label>
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
                            placeholder: "Skriv inn en ferdighet",
                            value: value,
                            onChange: (_, { newValue }) => {
                                setValue(newValue);
                            }
                        }}
                        highlightFirstSuggestion={true}
                    />
                    <Button variant="secondary"
                            type="button"
                            size="sm"
                            onClick={onAddSkillClick}>
                        Legg til
                    </Button>
                    <section>
                        {skillList !== undefined && skillList.map((skill, index) =>
                            <SkillList
                                skills={skill}
                                index={index}
                                removeElement={removeElement}
                            />)
                        }
                    </section>
                </Form.Group>

                <Form.Group className="form-group-cp" controlId="projectDescription">
                    <Form.Label className="form-label-cp">Beskrivelse av prosjektet</Form.Label>
                    <Form.Control className="form-control.cp"
                                  type="text"
                                  as="textarea"
                                  placeholder="Skriv litt om prosjektet"
                                  onChange={onDescriptionInputChange}
                    />
                </Form.Group>

                <Form.Group className="form-group-cp" controlId="projectImage">
                    <Form.File
                        type="text"
                        onChange={onImageInputChange}
                        label="Last opp bilde fra fil"
                        data-browse="Velg fil"
                        custom
                    />
                </Form.Group>
                <Button className="btn-cp"
                        variant="success"
                        type="button"
                        onClick={onButtonClick}>
                    Opprett
                </Button>
                <p style={{color : "red"}}>{errorMessage}</p>
            </Form>
        </div>
    );
}

export default CreateProject;
