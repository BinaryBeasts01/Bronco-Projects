import React, {useEffect, useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import {Button, Container, Nav, Offcanvas} from "react-bootstrap";
import AuthService from "../services/AuthService";
import AuthForm from "./AuthForm";
import SearchBar from "./SearchBar"
import {useNavigate} from "react-router-dom";

function NavBar({isLoggedIn, email, setEmail, setIsLoggedIn, setSearchInput}) {
    const [loginFormVisible, setShowLoginForm] = useState(false);
    const [navCollapsed, setNavCollapsed] = useState(false)

    const navigate = useNavigate();

    const logout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
        navigate("/");
    }

    useEffect(() => setNavCollapsed(window.innerWidth <= 768), []); // check if screen width <= md <- bootstrap

    let form;
    let profile;

    if(!AuthService.getUserIdFromToken()) {
        form = <AuthForm email={email} setEmail={setEmail} shouldShowLoginForm={loginFormVisible} setIsLoggedIn={setIsLoggedIn}
                            closeLoginForm={() => {setShowLoginForm(false)}}/>

        profile = <Button variant='success' onClick={() => {setShowLoginForm(true)}}> Login </Button>
    }
    else {
        // init profile with user icon
        setIsLoggedIn(true);
        // set email based on jwt token
        profile = <Button variant='danger' onClick={(e) => logout()}>Logout</Button>
    }

    useEffect(() => {
        if(isLoggedIn) AuthService.getUserIdFromToken().then((res) => setEmail(res));
    }, [isLoggedIn])

    let homeButton = <Button styles={{backgroundImage:"url('./images/logo.png')"}} onClick={(e) => {setSearchInput(null)}}> Home </Button>;
    let searchBar = <SearchBar setProjectsSearchInput={setSearchInput}/>;

    let homeNav =
        <Nav className="justify-content-begin flex-grow-1 pe-3">
        <Nav.Item> {homeButton} </Nav.Item>
    </Nav>

    let searchBarExpanded =
        <Container style={styles["searchBarExpanded"]}>
            {searchBar}
    </Container>

    let searchBarCollapsed =
        <Container style={styles["searchBarCollapsed"]}>
            {searchBar}
        </Container>

    let profileNav =
        <Nav className="justify-content-emd flex-grow-1 pe-3">
            <Nav.Item> {profile} </Nav.Item>
        </Nav>

    let expanded =
        <Container fluid>
            {homeNav}
            {searchBarExpanded}
            {profileNav}
    </Container>

    let collapsed =
        <Container fluid>
            {searchBarCollapsed}
            <Navbar.Toggle style={{backgroundColor: "white"}} aria-controls={`offcanvasNavbar-expand-lg`} />
            <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-lg`}
                aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                        Options
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {homeButton}
                    <br/>
                    <br/>
                    {profile}
                </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>

    return (
        <Navbar bg="dark" collapseOnSelect expand="lg" fixed="top" style={styles["navbar"]}>
            {navCollapsed ? collapsed : expanded}
            {form}
        </Navbar>
    );
}

const styles = {
    navbar: {
        "backgroundColor": "rgb(26,26,27)",
        borderBottom: "5px solid rgb(87, 88, 89)",
        zIndex: 2
    },
    logo: {
        "display": "flex",
        "justifyContent": "begin",
        "width": "5%",
    },
    searchBarExpanded: {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
    },
    searchBarCollapsed: {
        "display": "flex",
        "alignItems": "begin",
        "justifyContent": "begin",
        maxWidth: "75%"
    },
    profile: {
        "display": "flex",
        "justifyContent": "end",
    }
}

export default NavBar;