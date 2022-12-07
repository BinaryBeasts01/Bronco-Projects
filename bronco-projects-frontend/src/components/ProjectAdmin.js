import React, {useEffect, useState} from 'react';
import {ButtonGroup, Card, Col, Container, DropdownButton, Row} from "react-bootstrap";
import ProjectsService from "../services/ProjectsService";
import SubscribeStudentsModal from "./SubscribeStudentsModal";
import "../css/ProjectCard.css";
import {Text} from "react-native-web";
import {Dropdown} from "react-bootstrap";
import SendNotificationModal from "./SendNotificationModal";


const ProjectAdmin = () => {
    const [createdProjects, setCreatedProjects] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [selectedProject, setSelectProject] = useState(null)

    const [showSubscribeStudentsModal, setShowSubscribeStudentsModal] = useState(false);
    const [showSendNotificationModal, setShowSendNotificationModal] = useState(false);

    const states = {ACTIVE: "Active", IN_PROGRESS: "In Progress", CLOSED: "Closed"}

    const retrieveDropdownForState = (index, project) => {
        let res;
        let style = {justifyContent: "end"}
        if(project["status"] === states.ACTIVE) {
            res = <DropdownButton
                as={ButtonGroup}
                id={`dropdown-button-drop-down`}
                drop={"down"}
                variant="secondary"
                title={"Actions"}
                style={style}
            >
                <Dropdown.Item onClick={() => subscribeStudentsAction(index, project)}>Add Students</Dropdown.Item>
            </DropdownButton>
        }
        else if(project["status"] === states.IN_PROGRESS) {
            res = <DropdownButton
                as={ButtonGroup}
                id={`dropdown-button-drop-down`}
                drop={"down"}
                variant="secondary"
                title={"Actions"}
                style={style}
            >
                <Dropdown.Item onClick={() => sendMessageAction(project)}>Send Message</Dropdown.Item>
                <Dropdown.Item onClick={() => closeProjectAction(index)}>Close Project</Dropdown.Item>
            </DropdownButton>
        }
        else {
            res = <></>
        }
        return res;
    }

    const subscribeStudentsAction = (index, project) => { // called when user clicks on dropdown menu
        console.log("INSIDE CALL CHANGE STATE")
        setSelectedIndex(index);
        setSelectProject(project);
        setShowSubscribeStudentsModal(true);
    }

    const sendMessageAction = (project) => {
        setSelectProject(project);
        setShowSendNotificationModal(true);
    }

    const closeProjectAction = async (index) => {
        await ProjectsService.changeProjectStatus(createdProjects[index]["uuid"], states.CLOSED);

        let cp = [...createdProjects];
        let project = {...createdProjects[index]};
        project["status"] = states.CLOSED;
        cp[index] = project;

        console.log("SUBSCRIBED HERE")
        setCreatedProjects(cp);
    }

    const subscribeStudents = async (index, students) => { // called when user clicks apply on modal
        for(let student of students) {
            await ProjectsService.subscribeStudentToProject(createdProjects[index]["uuid"], student); // subscribe students
        }

        // change state of project
        await ProjectsService.changeProjectStatus(createdProjects[index]["uuid"], states.IN_PROGRESS);

        let cp = [...createdProjects];
        let project = {...createdProjects[index]};
        project["status"] = states.IN_PROGRESS;
        cp[index] = project;

        console.log("SUBSCRIBED HERE")
        setCreatedProjects(cp);
        closeSubscribeModal();
    }

    useEffect(() => {
        const fetchCreatedProjects = async () => {
            console.log("EFFECT HERE")
            let projects = await ProjectsService.getCreatedProjects();
            setCreatedProjects(projects);
        }

        fetchCreatedProjects();
    }, []);


    let createdProjectCards = createdProjects.map((proj, index) => {
        let bgColor;
        if(proj["status"] === states.ACTIVE) bgColor = 'green'
        else if(proj["status"] === states.IN_PROGRESS) bgColor = 'yellow'
        else bgColor = 'red'

        return (
            <Row style={styles["project-card-parent"]}>
                <Card key={index} style={{width: "100%", height: "100%"}} className={"project-card"} style={{backgroundColor: bgColor}}>
                    <Card.Header className="d-flex justify-content-between">
                        <Text style={{fontSize: "1em"}}> {proj["name"]} </Text>
                        {retrieveDropdownForState(index, proj)}
                    </Card.Header>
                </Card>
            </Row>
        );
    });

    const closeSubscribeModal = () => {
        setShowSubscribeStudentsModal(false)
        setSelectedIndex(null)
        setSelectProject(null)
    }

    const closeNotificationModal = () => {
        console.log("HERE")
        setShowSendNotificationModal(false);
        setSelectedIndex(null);
        setSelectProject(null);
    }


    let subscribeStudentsModal = showSubscribeStudentsModal ? <SubscribeStudentsModal shouldShowModal={showSubscribeStudentsModal} closeModal={closeSubscribeModal}
                                                         index={selectedIndex} project={selectedProject} subscribeStudentsFunc={subscribeStudents} closeModal={closeSubscribeModal}/> : null;

    let notificationModal = showSendNotificationModal ? <SendNotificationModal project={selectedProject} showSendNotificationModal={showSendNotificationModal} closeModal={closeNotificationModal}/> : null;

    //const loader = <div className="loader">Loading ...</div>;

    return (
        <Container fluid style={styles["projects-parent"]}>
            <Row md={12} className="justify-content-md-center" style={{overflowY: "scroll", width: "100%", height: "100%"}}>
                    <Col md={7} style={{height: "100%"}}>
                        {createdProjectCards}
                    </Col>
                </Row>

            {subscribeStudentsModal}
            {notificationModal}
        </Container>
    );
}

const styles = {
    "projects-parent": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        height: "100%",
        position: "relative",
        zIndex: 1,
        "backgroundColor": "rgb(3,3,3)",
    },
    projects: {
        "display": "flex",
        "flexDirection": "row",
        "width": "100%",
        "height": "100%",
        "backgroundColor": "rgb(3,3,3)",
    },
    padding: {
        "display": "flex",
        "width": "40%",
        "backgroundColor": "rgb(3,3,3)",
        "height": "100%"
    },
    "project-card-parent": {
        height: "10%",
        paddingBottom: "10%"
    },
    "project-card-padding": {
        height: "10%",
    },
}
export default ProjectAdmin;