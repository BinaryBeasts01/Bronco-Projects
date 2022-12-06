import React, {useState, useEffect} from "react";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import ProjectCreateForm from "./ProjectCreateForm";

const ActionCenter = ({email}) => {
    const navigate = useNavigate();

    const [openCreatedProjects, setOpenCreatedProjects] = useState(false);
    const [projectCreateFormVisible, setProjectCreateFormVisible] = useState(false);

    let projectCreateModal = <ProjectCreateForm showProjectCreateForm={projectCreateFormVisible} closeProjectCreateModal={() => setProjectCreateFormVisible(false)}/>

    useEffect(() => {
        if(openCreatedProjects)
            navigate("/project_admin");

    }, [openCreatedProjects])


    return (
        <div>
          <ListGroup horizontal={true} style={{paddingBottom: "10%"}}>
              <ListGroupItem style={{backgroundColor: "rgb(3,3,3)"}}>
                  <Button onClick={() => setProjectCreateFormVisible(true)}>Create Project</Button>
              </ListGroupItem>
              <ListGroupItem style={{backgroundColor: "rgb(3,3,3)"}}>
                  <Button onClick={() => setOpenCreatedProjects(true)}>View Created Projects</Button>
              </ListGroupItem>
          </ListGroup>
            {projectCreateModal}
        </div>
    );
}

export default ActionCenter;