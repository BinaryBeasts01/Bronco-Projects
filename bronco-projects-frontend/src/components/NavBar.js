import React, {useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import {Button, Container} from "react-bootstrap";
import AuthService from "../services/AuthService";
import AuthForm from "./AuthForm";

function NavBar({email, setEmail}) {
    const [loginFormVisible, setShowLoginForm] = useState(false);

    let authService = new AuthService();
    let form = null;
    let profile = null;

    if(!authService.checkJWTValid()) {
        form = <AuthForm email={email} setEmail={setEmail} shouldShowLoginForm={loginFormVisible}
                            closeLoginForm={() => {setShowLoginForm(false)}}/>

        profile = <Button variant='success' onClick={() => {setShowLoginForm(true)}}> Login </Button>
    }
    else {
        // init profile with user icon
        profile = <Button variant='success' onClick={(e) => {console.log(email)}}>PROFILE BUTTON</Button>
    }

    return (
        <Navbar fixed='top'>
            <Container className='justify-content-end'>
                {profile}
            </Container>
            {form}
        </Navbar>
    );
}


export default NavBar;