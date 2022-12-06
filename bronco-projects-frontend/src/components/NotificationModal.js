import React, {useState} from "react";
import ProjectsService from "../services/ProjectsService";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const NotificationModal = ({notification, showNotification, closeNotification}) => {
    if(!notification)
        notification = {"title": "", "from": "", "date": "", "message": ""}

    return (
        <Modal
            show={showNotification}
            onHide={closeNotification}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {notification["title"]}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>{`From: ${notification["from"]} On: ${notification["date"]}`}</h3>
                <p>
                    ${notification["message"]}
                </p>

            </Modal.Body>
        </Modal>
    );
}

export default NotificationModal;