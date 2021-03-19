import index from "../../redux/reducers";

function MainProjectListBanner({project, user}) {

    const compareLists = (pTags, uTags) => {

        let count = uTags.filter(u => pTags.some(p => u.tag === p.tag)).length;
        if (count === 0) return 0
        if (count > pTags.length/2) return 2
        if (count !== 0) return 1
    }

    return (
        <div>
            { ((project.projectTags && user.userTags) && project.owners.filter(x => x.id === user.id).length === 0) &&
                {
                0: <h4>Not qualified</h4>,
                1: <h4>Kinda qualified</h4>,
                2: <h4>Qualified</h4>,
            }[compareLists(project.projectTags, user.userTags)]}
        </div>
    );
}
export default MainProjectListBanner;
