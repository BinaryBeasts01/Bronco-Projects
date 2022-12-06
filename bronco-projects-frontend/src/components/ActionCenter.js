import React, {useState, useEffect} from "react";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const ActionCenter = ({email}) => {
    const navigate = useNavigate();

    const [openCreatedProjects, setOpenCreatedProjects] = useState(false);

    useEffect(() => {
        if(openCreatedProjects)
            navigate("/project_admin");

    }, [openCreatedProjects])


    return (
          <ListGroup horizontal={true} style={{paddingBottom: "10%"}}>
              <ListGroupItem style={{backgroundColor: "rgb(3,3,3)"}}>
                  <Button>Create</Button>
              </ListGroupItem>
              <ListGroupItem style={{backgroundColor: "rgb(3,3,3)"}}>
                  <Button onClick={() => setOpenCreatedProjects(true)}>My Projects</Button>
              </ListGroupItem>
          </ListGroup>
    );
}

export default ActionCenter;
