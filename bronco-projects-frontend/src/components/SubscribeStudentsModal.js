import React, {useState, useEffect} from 'react';
import ProjectsService from "../services/ProjectsService";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import openResume from "../services/FileService";


const SubscribeStudentsModal = ({shouldShowModal, closeModal, subscribeStudentsFunc, index, project}) => {
    console.log(`Index ${index}`);
    console.log(project)

    const [students, setStudents] = useState([]);
    // use effect that depends on project

    console.log(students);
    console.log(students);

    const handleChange = (e) => {
        const { value, checked } = e.target;
        if (checked)
            setStudents(prev => [...prev, value]);
        else
            setStudents(prev => prev.filter((s) => s !== value));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        subscribeStudentsFunc(index, students);
    }


    let studentCheckBoxes = project["interestedStudents"].map((student) => {
        return (
            <div style={{display: "flex", flexDirection: "row"}}>
                <Form.Check
                    type={"checkbox"}
                    value={student}
                    onChange={handleChange}
                />
                <span onClick={() => openResume(student)}>{student}</span>
            </div>
        );
    })

    return (
        <Modal
            show={shouldShowModal}
            onHide={closeModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Students To {project["name"]}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {studentCheckBoxes}
                    <br/>
                    <Button type={"submit"}>Submit</Button>
                </Form>

            </Modal.Body>
        </Modal>
    );
}

export default SubscribeStudentsModal;
