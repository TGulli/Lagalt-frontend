import {Link, useHistory, useParams} from "react-router-dom";
import TagList from "../shared/TagList";
import {useEffect, useState} from "react";
import {Container, Card} from "react-bootstrap";
import styles from "./ProfileDetailsInfo.module.css"

function ProfileDetailsInfo({user, loginState}) {

    console.log(user)
    let { id } = useParams();
    const [owner, setOwner] = useState(false)

    const history = useHistory()

    console.log(user.hidden)
    console.log('Owner: ' + owner)

    useEffect( () => {
        if(id === user.id){
            setOwner(true);
        }

    })


    return (
        <Container fluid="md">
            <div className={styles.pictureAndTitle}>
                <section>
                    <img className={styles.profilePicture} src="https://dkuni.dk/wp-content/uploads/2020/11/profil-billede-1.png"/>
                </section>
                <section>
                    <h1>{user.username}</h1>
                    <p>{user.hidden? "Skjult profil" : "Offentlig profil"}</p>

                </section>
            </div>
            {(!user.hidden || owner) ?
                <div>
                    <section className={styles.allInfo}>
                        <section className={styles.basicInfo}>
                            <section className={styles.contactInfo}>
                                <Card>
                                    <Card.Header>Grunnleggende informasjon</Card.Header>
                                    <div className={styles.basicInfoBody}>
                                        <p>Fullt navn: {user.name}</p>
                                        <p>E-postadresse: {user.email}</p>
                                        <p>Sted: {user.locale}</p>
                                    </div>
                                </Card>
                            </section>
                            <section className={styles.about}>
                                <Card>
                                    <Card.Header> Om meg: </Card.Header>
                                    <Card.Body>
                                        <p>{user.bio}</p>
                                    </Card.Body>
                                </Card>
                            </section>
                        </section>
                        <section className={styles.projects}>
                            <section className={styles.myProjects}>
                                <Card>
                                    <Card.Header>Mine prosjekter:</Card.Header>
                                    <Card.Body>
                                    {!user.hidden && user.ownedProjects.map(project => (
                                        <section>
                                            <Link to={`/projectdetails/${project.id}`}> {project.name} </Link>
                                        <br/>
                                        </section>
                                    ))}
                                    </Card.Body>
                                </Card>
                            </section>
                            <section className={styles.collaboratorProjects}>
                                <Card>
                                    <Card.Header>Prosjekter jeg deltar på: </Card.Header>
                                    <Card.Body>
                                        {!user.hidden && user.collaboratorIn.map(project => (
                                            <section>
                                                <Link to={`/projectdetails/${project.project.id}`}> {project.project.name} </Link>
                                                <br/>
                                            </section>

                                        ))}
                                    </Card.Body>
                                </Card>
                            </section>
                        </section>
                    </section>

                </div>
                :
                <Card>
                    <Card.Header> Grunnleggende informasjon </Card.Header>
                    <Card.Body>
                        <p>Brukernavn: {user.username}</p>
                        <p>Navn: {user.name}</p>
                    </Card.Body>
                </Card>

            }

        </Container>
    );
}
export default ProfileDetailsInfo;
