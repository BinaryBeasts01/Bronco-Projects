import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AuthService from "../services/AuthService";

const LoginForm = ({shouldShowLoginForm, closeLoginForm, showSignUpVerificationForm, setEmail, setIsLoggedIn}) => {
    const [emailForm, setEmailForm] = useState(null);
    const [password, setPassword] = useState(null);

    const handleLoginEvent = async (e) => {
        e.preventDefault()
        console.log(emailForm)
        let split = emailForm.split('@');
        console.log(`EMAIL ${emailForm}`);
        console.log(`SPLIT ${split}`);

        if(!emailForm.split('@')[1].includes('cpp.edu')) {
            console.log("NOT CPP EMAIL")
            // show error
        }
        else {
            setEmail(emailForm);
            let response = await AuthService.login(emailForm, password);
            console.log(response)
            if(response) {
                console.log("INSIDE NAVIGATOR");
                closeLoginForm();
                setIsLoggedIn(true);
            }
            else {
                // show error message
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
                    <Form.Control type="email" placeholder="Enter Email" onChange={(e) => setEmailForm(e.target.value)}/>
                    <br />
                    <Form.Control type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                    <br />
                    <Button type="submit">Login</Button>
                </Form>

            </Modal.Body>
            <Modal.Footer style={{justifyContent: "center", alignItems: "center"}}>
                <h6>
                    Don't have an account? <span style={{color:'blue',cursor:'pointer'}} onClick={showSignUpVerificationForm}> Create one! </span>
                </h6>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginForm;