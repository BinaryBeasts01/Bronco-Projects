import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const LoginForm = ({shouldShowLoginForm, closeLoginForm}) => {
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
               <Form>
                   <Form.Control type="email" placeholder="Enter Email" />
                   <br />
                   <Form.Control type="password" placeholder="Enter Password" />
                   <br />
                   <Button type="submit">Login</Button>
               </Form>

            </Modal.Body>
            <Modal.Footer>
                <h6>
                    Don't have an account? <span style={{color:'blue',cursor:'pointer'}}> Create one! </span>
                </h6>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginForm;