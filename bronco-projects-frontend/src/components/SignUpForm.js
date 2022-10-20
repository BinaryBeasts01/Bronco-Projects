import React from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
//import {useNavigate} from "react-router-dom";

const SignUpForm = ({email, showSignUpModal, closeSignUpModal}) => {
    //const navigate = useNavigate();

    const handleSubmitForm = (e) => {
        e.preventDefault();
        //navigate('/');
    }
    return (
        <Modal
            show={showSignUpModal}
            onHide={closeSignUpModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Sign Up
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitForm}>
                    <Form.Control type="password" placeholder="Enter Password" />
                    <br/>
                    <Form.Label>Provide Your Resume</Form.Label>
                    <Form.Control type="file"/>
                    <br/>
                    <Form.Label>Provide Your Transcript</Form.Label>
                    <Form.Control type="file" placeholder="Transcript"/>
                    <br/>
                    <Button type="submit" >Sign Up</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SignUpForm