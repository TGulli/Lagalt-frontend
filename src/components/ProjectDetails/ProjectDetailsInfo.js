
function ProjectDetailsInfo({project}) {

    return (
        <div>
            <h1>{project.name}</h1>
            <p>ID: {project.id}</p>
            <p>Status: {project.progress}</p>
            <p>Description: {project.description}</p>
            <p>Image: {project.image}</p>
        </div>
    );
}

export default ProjectDetailsInfo;


