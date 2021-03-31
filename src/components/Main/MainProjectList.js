import MainProjectListOwners from "./MainProjectListOwners";
import {NavLink, useHistory} from "react-router-dom";
import styles from './MainProjectList.module.css'
import TagList from "../shared/TagList";
import MainProjectListBanner from "./MainProjectListBanner";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import { ReactComponent as Logo} from '../../resources/kvalifisert.svg'

function MainProjectList({content, userState}) {
    const history = useHistory();

    const toProjectDetailsClick = param => e => { //TODO remove e?
        history.push('/projectdetails/' + param.toString())
    }


    return (
        <div>

            {content.map((project, index) => (
                <div key={index} className={styles.projectDisplay}>
                    <Container fluid={true} style={{margin: 0}}>
                        <Row>
                            <Col xs lg={1} className={styles.projectImageAndApproved}>
                                <div className={styles.projectImageAndApproved}>
                                    <Image src="https://bakingamoment.com/wp-content/uploads/2018/02/IMG_6267-creamy-rice-pudding-recipe-square2.jpg" fluid className={styles.projectImage} />
                                    <div className={styles.projectQualifiedBanner}>
                                        <MainProjectListBanner project={project} user={userState}/>
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div className={styles.projectHeader}>
                                    <Button type="button" value={project.id} variant="outline-primary" className={styles.projectClickableHeader}
                                            onClick={toProjectDetailsClick(project.id)}>
                                        <h4>{project.name}</h4>
                                        <h4>Status: {project.progress}</h4>
                                    </Button>
                                </div>

                                <div className={styles.projectContentContainer}>
                                    <div className={styles.projectDescriptionOwner}>
                                        <label htmlFor="ownerText">Eier:</label>
                                        {project.owner && <h4><NavLink to={"/userprofile/" + project.owner.id} activeClassName="selected"> {project.owner.name}</NavLink></h4>}
                                        {/*<MainProjectListOwners id="ownerText" owners={project.owners}/>*/}
                                        {/*<p>Description: {project.description}</p>*/}
                                    </div>
                                    <div className={styles.projectCategoryAndTags}>
                                        <div className={styles.projectCategoryContainer}>
                                            <label for="categoryText">Kategori:</label>
                                            <h4 id="categoryText">{project.category}</h4>
                                        </div>
                                        <div className={styles.projectTagsContainer}>
                                            <TagList tags={project.projectTags}/>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                </div>
            ))}
        </div>
    );
}

export default MainProjectList;


