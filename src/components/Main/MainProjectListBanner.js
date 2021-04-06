import NotQualified from '../../resources/ikke.svg'
import KindaQualifiedLogo from '../../resources/delvis.svg'
import QualifiedLogo from "../../resources/kvalifisert.svg"
import styles from './MainProjectListBanner.module.css'


function MainProjectListBanner({project, user}) {

    /**
     * This function takes in a list of user tags and a list of user tags, and
     * compares them to each other. If the user tags do not match any of the
     * project tags, the project shows a not qualified banner. If the user matches
     * less than half of the user tags, the project shows a partially qualified
     * banner. If the user tags matches equal to or more than half of the projects
     * tags the project show a qualified banner.
     * */
    const compareLists = (pTags = [], uTags = []) => {
        if(uTags !== null) {
            let count = uTags.filter(u => pTags.some(p => u.tag === p.tag)).length;
            let svgSrc = ''
            if (count === 0) {
                svgSrc = NotQualified
            }
            else if (count < pTags.length / 2) {
                svgSrc = KindaQualifiedLogo
            }
            else {
                svgSrc = QualifiedLogo
            }
            return svgSrc;
        }
    }


    /**
     * Function that calls on function compareLists to set the variabel svgSrc
     * which is the imagesource for the banner.
     */
    const svgSrc = compareLists(project.projectTags, user.userTags)


    return (
        <div>
            { ((project.projectTags && user.userTags) && (project.owner.id !== user.id)) &&
            <img src={svgSrc} className={styles.bannerImage} />
            }
        </div>
    );
}
export default MainProjectListBanner;
