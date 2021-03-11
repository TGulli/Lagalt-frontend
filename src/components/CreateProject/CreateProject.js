import {useState} from "react"
function CreateProject() {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [progress] = useState(0);
    const [image, setImage] = useState('');

    const onDescriptionInputChange = e => {
        setDescription(e.target.value)
    }
    const onNameInputChange = e => {
        setName(e.target.value)
    }
    const onImageInputChange = e => {
        setImage(e.target.value)
    }

    const onButtonClick = () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, description: description, progress: progress, image: image})
        };

        fetch('http://localhost:8080/api/v1/projects', requestOptions).then(r => console.log(r));
    }





    return (
        <div className="App">
            <h1>Create project</h1>
            <form>
                <fieldset>
                    <label htmlFor="name">Name</label>
                    <input id="name"  type="text" onChange={onNameInputChange}/>
                </fieldset>

                <fieldset>
                    <label htmlFor="description">Description</label>
                    <input id="description" type="text" onChange={onDescriptionInputChange}/>
                </fieldset>
                <fieldset>
                    <label htmlFor="image">Image</label>
                    <input id="image" type="text" onChange={onImageInputChange}/>
                </fieldset>
                <button type="button" onClick={onButtonClick}>Create</button>
            </form>
        </div>
    );
} export default CreateProject;
