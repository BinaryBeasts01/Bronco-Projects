import API_URL from "../constants/API_URL";
import AuthService from "./AuthService";
import axios from "axios";
import HttpStatusCodes from "http-status-codes";

const NOTIFICATIONS_URL = API_URL + "notifications/"

class NotificationsService {
    static getNotifications() {
        let url = NOTIFICATIONS_URL + "get";
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

    static sendNotification(projectId, title, message) {
        let url = NOTIFICATIONS_URL + "notify";
        let data = {id: projectId, title: title, message: message}

        let config = {
            method: 'post',
            url: url,
            headers: {
                ...AuthService.authHeader(),
                'Content-Type': 'application/json'
            },
            data: data
        };

        console.log("CONFIG")
        console.log(config)
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
        let url = NOTIFICATIONS_URL + "delete";
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