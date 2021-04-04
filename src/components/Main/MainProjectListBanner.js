import NotQualified from '../../resources/ikke.svg'
import KindaQualifiedLogo from '../../resources/delvis.svg'
import QualifiedLogo from "../../resources/kvalifisert.svg"
import styles from './MainProjectListBanner.module.css'


function MainProjectListBanner({project, user}) {

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
