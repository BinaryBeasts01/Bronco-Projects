import React, {useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import {Button, Container} from "react-bootstrap";
import AuthService from "../services/AuthService";
import AuthForm from "./AuthForm";
import SearchBar from "./SearchBar"

function NavBar({email, setEmail, setIsLoggedIn, setSearchInput}) {
    const [loginFormVisible, setShowLoginForm] = useState(false);

    let form;
    let profile;

    if(!AuthService.checkJWTValid()) {
        form = <AuthForm email={email} setEmail={setEmail} shouldShowLoginForm={loginFormVisible} setIsLoggedIn={setIsLoggedIn}
                            closeLoginForm={() => {setShowLoginForm(false)}}/>

        profile = <Button variant='success' onClick={() => {setShowLoginForm(true)}}> Login </Button>
    }
    else {
        // init profile with user icon
        setIsLoggedIn(true);
        profile = <Button variant='success' onClick={(e) => {console.log(email)}}>PROFILE BUTTON</Button>
    }

    return (
        <Navbar style={styles["navbar"]}>
            <Container style={styles["profile"]}>
                <Button variant='info' onClick={() => setSearchInput(null)}> LOGO </Button>
            </Container>
            <Container style={styles["searchBar"]}>
                <SearchBar setProjectsSearchInput={setSearchInput}/>
            </Container>
            <Container style={styles["profile"]}>
                {profile}
            </Container>
            {form}
        </Navbar>
    );
}

const styles = {
    navbar: {
        "backgroundColor": "black",
        "height": "10%",
        "position": "sticky"
    },
    logo: {
        "display": "flex",
        "justifyContent": "begin",
        "width": "5%",
    },
    searchBar: {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
    },
    profile: {
        "display": "flex",
        "justifyContent": "end",
        "width": "5%",
    }
}

export default NavBar;