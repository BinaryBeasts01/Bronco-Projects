import React, {useState} from "react";
import SampleProjects from "../constants/SampleProjects";
function Project({pageIndex,projectID}) {

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <h2 style={{color: 'white'}}>{SampleProjects[pageIndex]["projects"][projectID]["description"]}</h2>
        </div>
    );
}

export default Project;