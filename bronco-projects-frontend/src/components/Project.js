import React, {useState, useEffect} from "react";
import SampleProjects from "../constants/SampleProjects";
import ProjectsService from "../services/ProjectsService";
import {Button} from "react-bootstrap";
function Project({projectID}) {
    const [project, setProject] = useState(null);
    useEffect( () => {
        const assignProject = async () => {
            let proj = await ProjectsService.getProject(projectID)
            console.log("Project: " + proj)
            setProject(proj)
        }
        assignProject()
    })
    return (
        //{SampleProjects[pageIndex]["projects"][projectID]["description"]}

        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <h1 style={{color: 'white'}}>{!project ? "Loading": project["name"]}</h1>
            <h2 style={{color: 'white'}}>{!project ? "Loading": project["description"]}</h2>
            <Button onClick={() => ProjectsService.apply(projectID)}>Apply</Button>
        </div>
    );
}

export default Project;