import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AuthService from "../services/AuthService";

const SignUpForm = ({email, showSignUpModal, closeSignUpModal}) => {
    const [password, setPassword] = useState(null);
    const [name, setName] = useState(null);
    const [department, setDepartment] = useState(null);

    const [resume, setResumeFile] = useState(null);
    const [transcript, setTranscriptFile] = useState(null);

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        let result = await AuthService.signUp(email, password, name, department, resume, transcript);
        if(result) {
            await AuthService.login(email, password);
            //navigate("/");
        }
        else {
            // display error message.
            // maybe authService should return error message instead of false
            // so that user can know specific error.
        }
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
                    <Form.Control type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                    <br/>
                    <Form.Control type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)}/>
                    <br/>
                    <Form.Control type="text" placeholder="Enter Department" onChange={(e) => setDepartment(e.target.value)}/>
                    <br/>
                    <Form.Label>Provide Your Resume</Form.Label>
                    <Form.Control type="file" onChange={(e) => setResumeFile(e.target.files[0])}/>
                    <br/>
                    <Form.Label>Provide Your Transcript</Form.Label>
                    <Form.Control type="file" placeholder="Transcript" onChange={(e) => setTranscriptFile(e.target.files[0])}/>
                    <br/>
                    <Button type="submit" >Sign Up</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SignUpForm