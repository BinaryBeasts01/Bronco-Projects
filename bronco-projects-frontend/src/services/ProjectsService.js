import API_URL from "../constants/API_URL";
import axios from "axios";

const PROJECTS_URL = API_URL + "projects/";

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

    static getSearchProjects(search, page) {
        let url = PROJECTS_URL + "filter";
        let config = {
            method: 'get',
            url: url,
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
};

export default ProjectsService;