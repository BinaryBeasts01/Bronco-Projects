import React from "react";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";

const ActionCenter = () => {
    return (
      <Card>
          <Card.Title>Actions</Card.Title>
          <ListGroup>
              <ListGroupItem>
                  <Button>Create Project</Button>
              </ListGroupItem>
              <ListGroupItem>
                  <Button>View Created Projects</Button>
              </ListGroupItem>
          </ListGroup>
      </Card>
    );
}

export default ActionCenter;