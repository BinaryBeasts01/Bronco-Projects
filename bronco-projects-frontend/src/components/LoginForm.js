import React from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AuthService from "../services/AuthService";

const LoginForm = ({shouldShowLoginForm, closeLoginForm, showSignUpVerificationForm, setEmail}) => {

    const handleLoginEvent = async (e) => {
        e.preventDefault()
        let email = e.target.elements['email']
        let password = e.target.elements['password']
        if(!email.split('@')[1].includes('cpp.edu')) {
            console.log("NOT CPP EMAIL")
            // show error
        }
        else {
            let service = new AuthService();
            setEmail(email);
            try {
                let response = await service.login(email, password);
            } catch (e) {
                // display sign in error block
            }
        }
    }

    return (
        <Modal
            show={shouldShowLoginForm}
            onHide={closeLoginForm}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Login
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleLoginEvent}>
                    <Form.Control type="email" placeholder="Enter Email" />
                    <br />
                    <Form.Control type="password" placeholder="Enter Password" />
                    <br />
                    <Button type="submit">Login</Button>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <h6>
                    Don't have an account? <span style={{color:'blue',cursor:'pointer'}} onClick={showSignUpVerificationForm}> Create one! </span>
                </h6>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginForm;