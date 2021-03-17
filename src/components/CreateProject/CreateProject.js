import {useState} from "react"
import {useSelector} from "react-redux";

function CreateProject() {
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const user = useSelector(state => state.user);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [progress] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');

    const onDescriptionInputChange = e => {
        setDescription(e.target.value)
    }
    const onNameInputChange = e => {
        setName(e.target.value)
    }
    const onImageInputChange = e => {
        setImage(e.target.value)
    }
    const onCategoryInputChange = e => {
        setCategory(e.target.value)
    }

    const onButtonClick = () => {
        //TODO: INPUT VALIDATION

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, description: description, progress: progress, image: image, category: category, owners: [ { id: user.id } ]})
        };
        fetch('http://localhost:8080/api/v1/projects', requestOptions).then(r => console.log(r));

    }


    return (
        <div className="App">
            <h1>Create project</h1>
            <form>
                <fieldset>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" onChange={onNameInputChange}/>
                </fieldset>

                <fieldset>
                    <label htmlFor="description">Description</label>
                    <input id="description" type="text" onChange={onDescriptionInputChange}/>
                </fieldset>
                <fieldset>
                    <label htmlFor="image">Image</label>
                    <input id="image" type="text" onChange={onImageInputChange}/>
                </fieldset>
                <fieldset>
                    <label htmlFor="category">Category</label>
                    <input id="category" type="text" onChange={onCategoryInputChange}/>
                </fieldset>
                <button type="button" onClick={onButtonClick}>Create</button>
            </form>
        </div>
    );
}

export default CreateProject;
