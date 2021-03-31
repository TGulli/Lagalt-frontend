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

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [uniqueTags, setUniqueTags] = useState([])
    const [skillList, setSkillList] = useState([])
    // Brukes for auto suggest box
    const [value, setValue] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [suggestions, setSuggestions] = useState(uniqueTags)

    console.log('CreateProject: ' + token)
    console.log('CreateProject: ' + token.token)

    useEffect(() => {
        async function fetchFromApi() {
            let response = await getUniqueTags(token);
            setUniqueTags(response.toString().split(','))
            console.log(response.toString().split(','))
        }
        fetchFromApi()
    }, []);

    const onNameInputChange = e => {
        setName(e.target.value)
    }

    const onCategoryInputChange = e => {
        console.log(e.target.value)
        setCategory(e.target.value)
    }

    const onProgressInputChange = e => {
        setProgress(e.target.value)
    }

    const onDescriptionInputChange = e => {
        setDescription(e.target.value)
    }

    const getSuggestions = (value) => {
        return uniqueTags.filter(tag => tag.toLowerCase().startsWith(value.trim().toLowerCase())).slice(0, 10)
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

    const onImageInputChange = e => {
        setImage(e.target.value)
    }

    const onButtonClick = async () => {
        //check that the inputs are not empty

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
            body: JSON.stringify({name: name, description: description, progress: progress, image: image, category: category, projectTags: tagArray, owners: [ { id: user.id } ]})
        };
        await fetch('http://localhost:8080/api/v1/projects', requestOptions).then(r => {
            if (r){
                history.push("/")
            } else{
                setErrorMessage(r.message)
            }
        });
    }



    return (
        <div className="App">
            <Form className="form-cp">
                <h1 className="h1-cp">Oprett et prosjekt</h1>
                <Form.Group className="form-group-cp" controlId="projectName">
                    <Form.Label className="form-label-cp">Prosjektets tittel</Form.Label>
                    <Form.Control className="form-control-cp"
                                  type="text"
                                  placeholder="Skriv inn prosjektets tittel"
                                  onChange={onNameInputChange}
                    />
                </Form.Group>

                <Form.Group className="form-group-cp" controlId="projectCategory">
                    <Form.Label className="form-label-cp">Velg kategori</Form.Label>
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
                    <Form.Label className="form-label-cp">Velg prosjektets progresjons-status</Form.Label>
                    <Form.Control  className="form-control-cp"
                                   as="select"
                                   onChange={onProgressInputChange}>
                        <option value="0">Oppstart</option>
                        <option value="1">I prosess</option>
                        <option value="2">Holdt igjen</option>
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
