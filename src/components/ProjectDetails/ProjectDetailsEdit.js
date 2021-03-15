import {useState} from 'react'

/**
 * TODO: INPUT VALIDATION
 */


function ProjectDetailsEdit({project}) {

    

    const [name, setName] = useState('')
    const [progress, setProgress] = useState(0)
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')

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

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, description: description, progress: progress, image: image, owners: ownerArray })
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
            <button type="button" onClick={onSaveClicked}>Save changes</button>
        </div>
    );
}

export default ProjectDetailsEdit;


