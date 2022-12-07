import React, {useState, useEffect} from "react";
import {Button, ButtonToolbar, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import ProjectCreateForm from "./ProjectCreateForm";
import project from "./Project";
import projectCreateForm from "./ProjectCreateForm";

const ActionCenter = () => {
    const navigate = useNavigate();

    const [openCreatedProjects, setOpenCreatedProjects] = useState(false);
    const [showProjectCreateForm, setShowProjectCreateForm] = useState(false);

    let projectCreateModal;

    useEffect(() => {
        if(openCreatedProjects)
            navigate("/project_admin");

    }, [openCreatedProjects]);

   let projectCreateForm = <ProjectCreateForm showProjectCreateModal={showProjectCreateForm} closeProjectCreateModal={() => setShowProjectCreateForm(false)}/>

    return (
        <div>
          <ButtonToolbar style={{paddingBottom: "10%", backgroundColor: "rgb(3,3,3)"}}>
                  <Button className="justify-content-begin flex-grow-1 pe-3" onClick={() => setShowProjectCreateForm(true)}>Create</Button>
                  <Button className="justify-content-begin flex-grow-1 pe-3" onClick={() => setOpenCreatedProjects(true)}>My Projects</Button>
          </ButtonToolbar>
            {projectCreateForm}
        </div>
    );
}

export default ActionCenter;
