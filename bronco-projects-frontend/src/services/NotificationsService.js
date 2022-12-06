import API_URL from "../constants/API_URL";
import AuthService from "./AuthService";
import axios from "axios";
import HttpStatusCodes from "http-status-codes";


const AUTH_URL = API_URL + "auth/";
const PROJECTS_URL = API_URL + "projects/";

class NotificationsService {
    static getNotifications() {
        let url = AUTH_URL + "notifications/get";
        let config = {
            method: 'get',
            url: url,
            headers: {
                ...AuthService.authHeader(),
                'Content-Type': 'application/json'
            },
        };

        return axios(config)
            .then((response) => {
                console.log("Notifications")
                console.log(response.data)
                return response.data
            });
    }

    static sendNotification(projectId, message) {
        let url = PROJECTS_URL + "notify";
        let data = {id: projectId, message: message}

        let config = {
            method: 'post',
            url: url,
            headers: {
                ...AuthService.authHeader(),
                'Content-Type': 'application/json'
            },
            data: data
        };

        return axios(config)
            .then((response) => {
                if (response.status === HttpStatusCodes.OK) {
                    console.log("SUCCESS")
                    return true;
                }
                else {
                    return false;
                }
            });
    }

    static deleteNotifications = () => {
        let url = AUTH_URL + "notifications/delete";
        let config = {
            method: 'get',
            url: url,
            headers: {
                ...AuthService.authHeader(),
                'Content-Type': 'application/json'
            },
        };

        return axios(config)
            .then((response) => {
                if (response.status === HttpStatusCodes.OK) {
                    console.log("SUCCESS")
                    return true;
                }
                else {
                    return false;
                }
            });
    }
}

export default NotificationsService;