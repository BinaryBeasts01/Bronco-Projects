import API_URL from "../constants/API_URL";
import axios from "axios";

const PROJECTS_URL = API_URL + "projects/";
const AUTH_URL = API_URL + "auth/"

class ProjectsService {
    static getProjectsPage(page) {
        let url = PROJECTS_URL + "latest";
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            params: {page: page}
        };

        return axios(config)
            .then((response) => {
                console.log("PROJECTS")
                console.log(response.data)
                return response.data
            });
    }

    static getSearchProjects(data, page) {
        let url = PROJECTS_URL + "filter";
        let config = {
            method: 'post',
            url: url,
            data: data,
            params: {page: page},
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return axios(config)
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
    }

    static getCreatedProjects(email) {
        let url = AUTH_URL + "id";
        let data = {"id": email}
        let config = {
            method: 'post',
            url: url,
            headers: {'Content-Type': 'application/json'},
            data: data
        }
        return axios(config)
            .then((response) => {
                return response.data["createdProjects"];
            })
    }

    static subscribeStudentToProject(projectId, email) {
        let url = PROJECTS_URL + "subscribe";
        let data = {"project_id": email, "student_id": email}
        let config = {
            method: 'post',
            url: url,
            headers: {'Content-Type': 'application/json'},
            data: data
        }
        return axios(config) // <------------ This pattern is duplicated can in the future abstract this out.
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
    }

    static changeProjectStatus(projectId, state) {
        let url = PROJECTS_URL + "status";
        let data = {"id": projectId, "status": state}
        let config = {
            method: 'post',
            url: url,
            headers: {'Content-Type': 'application/json'},
            data: data
        }
        return axios(config) // <------------ This pattern is duplicated can in the future abstract this out.
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
    }

    static getProject(id) {
        let url = PROJECTS_URL + "id";
        let data = {"id": id}
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }
        return axios(config)
            .then((response) => {
                console.log(response.data);
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            })
    }
};

export default ProjectsService;