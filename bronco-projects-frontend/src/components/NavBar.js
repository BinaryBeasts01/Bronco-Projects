import React, {useEffect, useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import {Button, Container} from "react-bootstrap";
import AuthService from "../services/AuthService";
import AuthForm from "./AuthForm";
import SearchBar from "./SearchBar"
import {useNavigate} from "react-router-dom";
import Logo from "../Logo.svg"

function NavBar({isLoggedIn, email, setEmail, setIsLoggedIn, setSearchInput}) {
    const [loginFormVisible, setShowLoginForm] = useState(false);

    const navigate = useNavigate();

    const logout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
        navigate("/");
    }

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

    return (
        <Navbar style={styles["navbar"]}>
            <Container style={styles["profile"]}>
                <Button styles={{backgroundImage: `url(${Logo})`, backgroundSize:"cover", width:"10%", height:"70%"}} onClick={(e) => {setSearchInput(null)}}/>
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