// if not logged in, show popup and redirect home

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import NavBar from "../components/NavBar";
import Project from "../components/Project";
import ProjectAdmin from "../components/ProjectAdmin";
import {Container, Row} from "react-bootstrap";
import Projects from "../components/Projects";

const ProjectAdminScreen = () => {
    let navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(true); // if user sees this screen,
                                                                // it must mean they already logged in because if they are not,
                                                                // we are not displaying button to view created projects

    const [email, setEmail] = useState(null);
    const [searchInput, setSearchInput] = useState(''); // either user clicks home button in which case null, or user types something in searchbar

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
                <ProjectAdmin />
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

export default ProjectAdminScreen