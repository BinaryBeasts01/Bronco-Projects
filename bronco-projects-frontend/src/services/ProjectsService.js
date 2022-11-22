import API_URL from "../constants/API_URL";
import axios from "axios";

const PROJECTS_URL = API_URL + "projects/";
const PROJECT_URL = API_URL + "project/";

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
    static getProject(id) {
        let url = PROJECT_URL + toString(id);
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: toString(id)
        }
        return axios(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            })
    }
};

export default ProjectsService;