import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AuthService from "../services/AuthService";
import NotificationsService from "../services/NotificationsService";

const SendNotificationModal = ({project, showSendNotificationModal, closeModal}) => {

    const [title, setTitle] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        console.log(title, message);
        await NotificationsService.sendNotification(project["uuid"], title, message); // in the future can show success message await NotificationService.sendNotification and if true display success
                                                                                // one problem, notification gets sent to email as well and that is a bottleneck
        closeModal();
    }

    return (
        <Modal
            show={showSendNotificationModal}
            onHide={closeModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Send a Message
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitForm}>
                    <Form.Control type="text" placeholder="Enter Notification Title" onChange={(e) => setTitle(e.target.value)}/>
                    <br/>
                    <Form.Control type="text" placeholder="Enter Notification Message" onChange={(e) => setMessage(e.target.value)}/>
                    <br/>
                    <Button type="submit" >Send</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default SendNotificationModal