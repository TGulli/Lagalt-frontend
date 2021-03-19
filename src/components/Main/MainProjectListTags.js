
function MainProjectListTags({tags}) {

    return (
        <div>
            {tags !== undefined && tags.map((tags, index) => (
                <p key={index}>Tags: {tags.tag}</p>
            ))}
        </div>
    );
}
export default MainProjectListTags;
