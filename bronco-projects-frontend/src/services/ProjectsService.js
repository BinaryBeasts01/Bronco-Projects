import API_URL from "../constants/API_URL";
import axios from "axios";
import AuthService from "./AuthService";
import FormData from "form-data";
import HttpStatusCodes from "http-status-codes";

const PROJECTS_URL = API_URL + "projects/";

class ProjectsService {
    static getProjectsPage(page) {
        let url = PROJECTS_URL + "latest";
        let config = {
            method: 'post',
            url: url,
            headers: {
                ...AuthService.authHeader(),
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
    static createProject(name, description, image, tags, department) {
        const FormData = require('form-data');
        let url = PROJECTS_URL + "create";

        let data = new FormData();
        data.append("name", name);
        data.append("description", description);
        data.append("image", image);
        data.append("tags", tags);
        data.append("department", department);
        console.log(data)
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...AuthService.authHeader()
            },
            data : data
        };
        return axios(config)
            .then((response) => {
                if (response.status === HttpStatusCodes.OK) {
                    return true;
                }
                else {
                    return false;
                }
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

    static getCreatedProjects() {
        let url = PROJECTS_URL + "created";
        let config = {
            method: 'get',
            url: url,
            headers: {'Content-Type': 'application/json', ...AuthService.authHeader()},
        }
        return axios(config)
            .then((response) => {
                console.log("CREATED PROJECTS")
                console.log(response.data)
                return response.data; // not checking for error because project admin screen could only be opened when user is logged in. might be cleaner to check for error however
            })
    }

    static subscribeStudentToProject(projectId, email) {
        let url = PROJECTS_URL + "subscribe";
        let data = {"id": projectId, "user": email}

        let config = {
            method: 'post',
            url: url,
            headers: {'Content-Type': 'application/json', ...AuthService.authHeader()},
            data: data
        }

        return axios(config) // <------------ This pattern is duplicated can in the future abstract this out.
                            // would be better if these static functions take in a func callback so that we can call func(response.data)
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
            headers: {'Content-Type': 'application/json', ...AuthService.authHeader()},
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