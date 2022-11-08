import React, {useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import {Button, Container} from "react-bootstrap";
import AuthService from "../services/AuthService";
import AuthForm from "./AuthForm";
import SearchBar from "./SearchBar"

function NavBar({email, setEmail}) {
    const [loginFormVisible, setShowLoginForm] = useState(false);

    let authService = new AuthService();
    let form = null;
    let profile = null;

    if(!authService.checkJWTValid()) {
        form = <AuthForm email={email} setEmail={setEmail} shouldShowLoginForm={loginFormVisible}
                            closeLoginForm={() => {setShowLoginForm(false)}}/>

        profile = <Button style={{backgroundColor:'rgb(47, 93, 18)'}} variant='success' onClick={() => {setShowLoginForm(true)}} > Login </Button>
    }
    else {
        // init profile with user icon
        profile = <Button variant='success' onClick={(e) => {console.log(email)}}>PROFILE BUTTON</Button>
    }

    return (
        <Navbar style={styles["navbar"]}>
            <Container style={styles["logo"]}>
                <img style={styles["CCProjects"]} src={require('/Users/lyhoang/Desktop/ly3/bronco-projects-frontend/src/components/logoAni.gif')} />
            </Container>
            <Container style={styles["searchBar"]}>
                <SearchBar />
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
        "backgroundColor": "white",
        "height": "20%",
        "position": "sticky",
        "backgroundColor": "white",
    },
    logo: {
        "display": "flex",
        "width": "30%",
        "justifyContent": "begin",
    },

    CCProjects: {
        "width": "100%"
    },

    searchBar: {
        "display": "flex",
        "alignItems": "center",
        "width": "55%",
        "justifyContent": "center",

    },
    profile: {
        "display": "flex",
        "width": "15%",
        "justifyContent": "center",

    },

}


export default NavBar;