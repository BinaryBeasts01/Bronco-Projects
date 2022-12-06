import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ProjectsService from "../services/ProjectsService";

const ProjectCreateForm = ({showProjectCreateModal, closeProjectCreateModal}) => {
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState(null);
    const [department, setDepartment] = useState(null);

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        let result = await ProjectsService.createProject(name, description, image, tags, department);
        if(result) {
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
            show={showProjectCreateModal}
            onHide={closeProjectCreateModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create Project
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitForm}>
                    <Form.Control type="text" placeholder="Enter Project Name" onChange={(e) => setName(e.target.value)}/>
                    <br/>
                    <Form.Control type="text" placeholder="Enter Description" onChange={(e) => setDescription(e.target.value)}/>
                    <br/>
                    <Form.Label>Provide an Image</Form.Label>
                    <Form.Control type="file" onChange={(e) => setImage(e.target.value)}/>
                    <br/>
                    <Form.Control type="text" placeholder="Enter Tags" onChange={(e) => setTags(e.target.value)}/>
                    <br/>
                    <Form.Control type="text" placeholder="Enter Department" onChange={(e) => setDepartment(e.target.value)}/>
                    <br/>
                    <Button type="submit" >Create</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ProjectCreateForm