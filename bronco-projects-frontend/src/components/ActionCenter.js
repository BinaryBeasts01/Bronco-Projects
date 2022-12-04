import React from "react";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const ActionCenter = ({email}) => {
    const navigate = useNavigate();

    const openProjectAdmin = () => {
        navigate("/project_admin", {state:{email: email}});
    }

    return (
      <Card>
          <Card.Title>Actions</Card.Title>
          <ListGroup>
              <ListGroupItem>
                  <Button>Create Project</Button>
              </ListGroupItem>
              <ListGroupItem>
                  <Button onClick={openProjectAdmin}>View Created Projects</Button>
              </ListGroupItem>
          </ListGroup>
      </Card>
    );
}

export default ActionCenter;