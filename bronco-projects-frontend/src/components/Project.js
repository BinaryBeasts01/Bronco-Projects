import React, {useState, useEffect} from "react";
import SampleProjects from "../constants/SampleProjects";
import ProjectsService from "../services/ProjectsService";
import {Button, ListGroup, ListGroupItem} from "react-bootstrap";
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

    return (
        //{SampleProjects[pageIndex]["projects"][projectID]["description"]}
        <div style={styles["project-parent"]}>
           <div style={styles["title"]}>
               <Text style={{color: "white", fontSize: "150%", "justifyContent": "center", "alignItems": "center", textAlign: "center"}}>{name}</Text>
           </div>
            <br/>
            <br/>
            <div style={styles["metadata"]}>
                <div style={styles["description"]}>
                    <Text style={{color: "white", fontSize: "150%", "justifyContent": "center", "alignItems": "center"}}>{name}</Text>
                </div>
                <div style={styles["misc"]}>
                    <div style={{height: "20%", paddingBottom: "5%", border: "1px solid rgb(87, 88, 89)"}}>
                        <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={image} alt="Image"/>
                    </div>

                    <div style={{height: "10%", borderBottom: "1px solid rgb(87, 88, 89)", paddingTop: "5%"}}>
                        <Text style={{color: "white", fontSize: "90%", "justifyContent": "center", "alignItems": "center"}}>{`Created By:\n${createdBy}`}</Text>
                    </div>
                    <br/>
                    <div style={{height: "10%", borderBottom: "1px solid rgb(87, 88, 89)"}}>
                        <Text style={{color: "white", fontSize: "90%", "justifyContent": "center", "alignItems": "center"}}>{`On:\n${date}`}</Text>
                    </div>
                    <br/>
                    <div style={{height: "10%", borderBottom: "1px solid rgb(87, 88, 89)"}}>
                        <Text style={{color: "white", fontSize: "90%", "justifyContent": "center", "alignItems": "center"}}>{`Department:\n${department}`}</Text>
                    </div>
                    <br/>
                    <div style={{height: "10%", paddingBottom: "5%"}}>
                        <Text style={{color: "white", fontSize: "90%", "justifyContent": "center", "alignItems": "center"}}>{`Tags:\n${tags}`}</Text>
                    </div>
                    <div style={{height: "10%"}}>
                        {isLoggedIn ? <Button style={{width:"100%"}} variant={"success"} onClick={() => ProjectsService.apply(projectID)}>Apply</Button> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    "project-parent": {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "center",
        "justifyContent": "center",
        "height": "90%",
        "paddingTop": "50px",
        position: "relative",
        zIndex: 1,
    },
    "title": {
        width: "25%",
        height: "10%",
        "alignItems": "center",
        "justifyContent": "center",
        border: "3px solid green",
        borderRadius: "3px",
        textAlign: "center",
    },
    "metadata": {
        width: "25%",
        height: "90%",
        display: "flex",
        flexDirection: "row",
        border: "3px solid green",
        borderRadius: "3px"
    },
    "description": {
        width: "60%"
    },
    "misc": {
        width: "40%",
        paddingLeft: "10%",
        display: "flex",
        flexDirection: "column"
    }
}

export default Project;
