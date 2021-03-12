import MainProjectListOwners from "./MainProjectListOwners";


function MainProjectList({content}) {

    return (
        <div>
            <h1>Projects!</h1>

            {content.map((project, index) => (
                <div key={index}>
                    <h4>Project name: {project.name}</h4>
                    <p>Description: {project.description}</p>
                    <p>Status: {project.progress}</p>
                    <p>Image: {project.image}</p>
                    <MainProjectListOwners owners={project.owners}/>
                </div>
            ))}
        </div>
    );
}

export default MainProjectList;


