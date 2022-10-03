import React from "react";
import Navbar from "react-bootstrap/Navbar";
import {Button, Container} from "react-bootstrap";

function NavBar({ handleLoginClick }) {

    return (
        <Navbar fixed='top'>
            <Container className='justify-content-end'>
                <Button variant='success' onClick={handleLoginClick}> Login </Button>
            </Container>
        </Navbar>
    );
}


export default NavBar;