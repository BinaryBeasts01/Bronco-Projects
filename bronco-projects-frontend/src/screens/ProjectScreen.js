import React, {useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import Project from "../components/Project";
import {useNavigate, useParams} from "react-router-dom";
import {Container, Row} from "react-bootstrap";
import ProjectAdmin from "../components/ProjectAdmin";

const ProjectScreen = () => {
    const [email, setEmail] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [searchInput, setSearchInput] = useState('');

    const { id } = useParams()

    let navigate = useNavigate();

    useEffect(() => {
        if(searchInput !== '') {
            console.log("HERE")
            navigate("/", {state: {searchInput: searchInput}});
        }
    }, [searchInput]);

    return (
        <Container fluid style={styles.home}>
            <Row sm={12} md={12} lg={12} xxl={12} style={{height: "10%"}}>
                <NavBar isLoggedIn={isLoggedIn} email={email} setEmail={setEmail} setIsLoggedIn={setIsLoggedIn} setSearchInput={setSearchInput}/>
            </Row>

            <Row sm={12} md={12} lg={12} xxl={12} style={{height: "90%"}}>
                <Project projectID={id} isLoggedIn={isLoggedIn}/>
            </Row>
        </Container>
    );
}

const styles = {
    home: {
        "fontFamily": "sans-serif",
        "backgroundColor": "black",
        "width": "100%",
        "height": "100%"
    },
}

export default ProjectScreen