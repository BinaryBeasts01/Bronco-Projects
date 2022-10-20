import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const VerificationForm = ({setEmail, shouldShowVerificationForm, closeVerificationForm, showNextModal}) => {
    const [formEmail, setFormEmail] = useState(null)
    const [verificationCode, setVerificationCode] = useState(null)

    const [emailSubmitted, setEmailSubmitted] = useState(false)

    const handleVerificationCode = (e) => {
        e.preventDefault()
        // verify code
        console.log(verificationCode)
        // if code is correct
        closeVerificationForm()
        showNextModal()
    }

    const handleEmailSubmit = (e) => {
        e.preventDefault()
        setEmailSubmitted(true)
        setEmail(formEmail)
        console.log(formEmail)
        // send code
    }

    let form = null
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