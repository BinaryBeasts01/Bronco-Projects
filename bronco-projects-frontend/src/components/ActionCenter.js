import React, {useState, useEffect} from "react";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
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
          <ListGroup horizontal={true} style={{paddingBottom: "10%"}}>
              <ListGroupItem style={{backgroundColor: "rgb(3,3,3)"}}>
                  <Button onClick={() => setShowProjectCreateForm(true)}>Create</Button>
              </ListGroupItem>
              <ListGroupItem style={{backgroundColor: "rgb(3,3,3)"}}>
                  <Button onClick={() => setOpenCreatedProjects(true)}>My Projects</Button>
              </ListGroupItem>
          </ListGroup>
            {projectCreateForm}
        </div>
    );
}

export default ActionCenter;