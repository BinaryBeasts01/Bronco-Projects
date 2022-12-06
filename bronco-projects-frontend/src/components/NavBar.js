import React, {useEffect, useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import {Button, Container} from "react-bootstrap";
import AuthService from "../services/AuthService";
import AuthForm from "./AuthForm";
import SearchBar from "./SearchBar"

function NavBar({isLoggedIn, email, setEmail, setIsLoggedIn, setSearchInput}) {
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
        // set email based on jwt token
        profile = <Button variant='success' onClick={(e) => {console.log(email)
            AuthService.logout()
            window.location.reload()}}>Logout</Button>
    }

    useEffect(() => {
        if(isLoggedIn) AuthService.getUserIdFromToken().then((res) => setEmail(res));
    }, [isLoggedIn])

    return (
        <Navbar style={styles["navbar"]}>
            <Container style={styles["profile"]}>
                <Button variant='info' onClick={(e) => {setSearchInput(null)}}> LOGO </Button>
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
        "backgroundColor": "rgb(26,26,27)",
        "height": "10%",
        "position": "sticky",
        borderBottom: "5px solid rgb(87, 88, 89)",
        zIndex: 2
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