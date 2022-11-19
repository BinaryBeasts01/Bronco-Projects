import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AuthService from "../services/AuthService";

const VerificationForm = ({setEmail, shouldShowVerificationForm, closeVerificationForm, showNextModal}) => {
    const [formEmail, setFormEmail] = useState(null)
    const [verificationCode, setVerificationCode] = useState(null)

    const [emailSubmitted, setEmailSubmitted] = useState(false)

    const handleVerificationCode = async (e) => {
        e.preventDefault()
        // verify code
        let correctCode = await AuthService.verifyCode(formEmail, verificationCode);
        if(correctCode) {
            closeVerificationForm()
            showNextModal()
        }
        else {
            // display error message
            // add buttons to resend when clicked sets emailSubmitted to false
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        // check if email contains cpp.edu
        // send code
        console.log(`FORM EMAIL ${formEmail}`);
        if(!formEmail.split('@')[1].includes('cpp.edu')) {
            console.log("NOT CPP EMAIL")
            // show error
        }
        else {
            await AuthService.sendCode(formEmail);

            setEmailSubmitted(true);
            setEmail(formEmail);
        }
    }

    let form;
    if(!emailSubmitted) {
        form = <Form onSubmit={handleEmailSubmit}>
            <Form.Control type="email" placeholder="Enter Email" onChange={(e) => setFormEmail(e.target.value)}/>
            <br />
            <Button type="submit"> Submit</Button>
        </Form>
    }
    else {
        form = <Form onSubmit={handleVerificationCode}>
            <Form.Control type="number" onChange={(e) => {setVerificationCode(e.target.value)}}/>
            <br />
            <Button type="submit">Submit</Button>
        </Form>
    }

    return  (
        <Modal
            show={shouldShowVerificationForm}
            onHide={closeVerificationForm}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {!emailSubmitted ? "Verification" : "Enter Verification Code"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {form}
            </Modal.Body>
        </Modal>
    );
}

export default VerificationForm