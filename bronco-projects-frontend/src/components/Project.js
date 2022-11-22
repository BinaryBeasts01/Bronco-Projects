import React, {useState} from "react";
import SampleProjects from "../constants/SampleProjects";
import ProjectsService from "../services/ProjectsService";
function Project({projectID}) {
    var id = parseInt(projectID)
    console.log(ProjectsService.getProject(id));
    return (
        //{SampleProjects[pageIndex]["projects"][projectID]["description"]}

        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <h2 style={{color: 'white'}}>{id}</h2>
        </div>
    );
}

export default Project;