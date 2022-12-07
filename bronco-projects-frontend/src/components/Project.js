import React, {useState, useEffect} from "react";
import SampleProjects from "../constants/SampleProjects";
import ProjectsService from "../services/ProjectsService";
import {Button, Card, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {Text} from "react-native-web";

function Project({projectID, isLoggedIn}) {
    const [project, setProject] = useState(null);
    useEffect( () => {
        const assignProject = async () => {
            let proj = await ProjectsService.getProject(projectID)
            console.log("Project: " + proj)
            setProject(proj)
        }
        assignProject()
    },[])

    let name, image, department, tags, description, date, createdBy = "LOADING";

    if(project) {
        name = project["name"];
        description = project["description"];
        image = `data:image/${project["extension"]};base64, ${project["image"]}`
        date = project["dateCreated"];
        createdBy = project["createdBy"];
        department = project["department"];
        tags = "";
        project["tags"].forEach((tag, i) => {
            if(i !== project["tags"].length - 1)
                tags += `${tag}, `
            else
                tags += tag
        });
    }
    // in the future can put values in a dict like info["name"] = SOMETHING and iterate over keys, and for each key creating a row
    // a lot of duplicated code below. Would be better to abstract

    return (
        //{SampleProjects[pageIndex]["projects"][projectID]["description"]}
        <Container fluid style={styles["project-parent"]}>
            <Card style={{width: "100%", height: "100%", backgroundColor: "rgb(3,3,3)", border: "1 px solid green"}}>
                <Card.Header className="d-flex justify-content-between">
                    <Text style={styles["title"]}> {name} </Text>
                </Card.Header>
                <Card.Body>
                    <Row md={12} style={{width: "100%", height: "100%"}}>
                        <Col md={7} style={{height: "100%", justifyContent: "center", alignItems: "center"}}>
                            <Text style={{...styles["text"], ...styles["overflow"]}}>{description}</Text>
                        </Col>
                        <Col md={{span: 4, offset: 1}} style={{height: "100%"}}>
                            <Row style={styles["padding"]}>
                                <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={image} alt="Image"/>
                            </Row>
                            <Row style={styles["padding"]}>
                                <Text style={styles["text"]}>{`Created By: ${createdBy}`}</Text>
                            </Row>
                            <Row style={styles["padding"]}>
                                <Text style={styles["text"]}>{`On: ${date}`}</Text>
                            </Row>
                            <Row style={styles["padding"]}>
                                <Text style={styles["text"]}>{`Department: ${department}`}</Text>
                            </Row>
                            <Row style={styles["padding"]}>
                                <Text style={styles["text"]}>{`Tags: ${tags}`}</Text>
                            </Row>
                            <Row style={styles["padding"]}>
                                {isLoggedIn ? <Button style={{width:"100%"}} variant={"success"} onClick={() => ProjectsService.apply(projectID)}>Apply</Button> : null}
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

const styles = {
    "project-parent": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        height: "100%",
        position: "relative",
        zIndex: 1,
        "backgroundColor": "rgb(3,3,3)",
    },
    text: {
        color: "white",
        fontSize: "1em",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        color: "white",
        fontSize: "1.2em",
        justifyContent: "center",
        alignItems: "center"
    },
    overflow: {
        overflowY: "scroll"
    },
    padding: {
        paddingBottom: "5%"
    }
}

export default Project;