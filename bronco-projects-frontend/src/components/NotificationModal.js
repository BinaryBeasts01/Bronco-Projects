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
                <p>{`From: ${notification["from"]} On: ${notification["date"]}`}</p>
                <br/>
                <p>
                    {notification["message"]}
                </p>

            </Modal.Body>
        </Modal>
    );
}

export default NotificationModal;