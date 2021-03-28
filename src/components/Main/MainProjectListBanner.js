import index from "../../redux/reducers";
import {ReactComponent as QualifiedLogo} from "../../resources/kvalifisert.svg";
import {ReactComponent as KindaQualifiedLogo} from "../../resources/delvis.svg";
import {ReactComponent as NotQualifiedLogo} from "../../resources/ikke.svg";

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
                0: <NotQualifiedLogo />,
                1: <KindaQualifiedLogo />,
                2: <QualifiedLogo />,
            }[compareLists(project.projectTags, user.userTags)]}
        </div>
    );
}
export default MainProjectListBanner;
