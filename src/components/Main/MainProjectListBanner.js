import index from "../../redux/reducers";

function MainProjectListBanner({projectTags, userTags}) {

    const compareLists = (pTags, uTags) => {

        let count = uTags.filter(o1 => pTags.some(o2 => o1.tag === o2.tag)).length;
        if (count === 0) return 0
        if (count > pTags.length/2) return 2
        if (count !== 0) return 1
    }

    return (
        <div>
            { (projectTags && userTags) &&
                {
                0: <h4>Not qualified</h4>,
                1: <h4>Kinda qualified</h4>,
                2: <h4>Qualified</h4>,
            }[compareLists(projectTags, userTags)]}
        </div>
    );
}
export default MainProjectListBanner;
