import jwt_decode from "jwt-decode";

import axios from 'axios';
import API_URL from '../constants/API_URL'

const AUTH_URL = API_URL + "auth/";

const HttpStatusCodes = require("http-status-codes");

class AuthService {
    static login(username, password) {
        let url = AUTH_URL + "login";
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data : { "username": username, "password": password }
        };
        return axios(config)
            .then((response) => {
                if (response.data['accessToken']) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    return true
                }
                else {
                    console.log("INVALID CREDS");
                    return false
                }
            });
    }

    static sendCode(email) {
        let url = AUTH_URL + "verificationcode";
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'text/plain'
            },
            data : email
        };
        return axios(config)
            .then((response) => {
                console.log(response)
                return;
            });
    }

    static verifyCode(email, code) {
        console.log("INSIDE VERIFY")
        let url = AUTH_URL + "verification";
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data : {"email": email, "code": code}
        };
        console.log(`CONFIG: ${config}`)
        return axios(config)
            .then((response) => {
                return (response.status === HttpStatusCodes.ACCEPTED);
            });
    }

    static signUp(email, password, name, department, resumeFile, transcriptFile) {
        const FormData = require('form-data');
        let url = AUTH_URL + "user";

        let data = new FormData();
        data.append("email", email);
        data.append("password", password);
        data.append("name", name);
        data.append("department", department);
        data.append("resume", resumeFile);
        data.append("transcript", transcriptFile);
        console.log(data)
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'multipart/form-data'
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

    static logout() {
        localStorage.removeItem("user");
    }

    static authHeader() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user['accessToken']) {
            return { 'Authorization': 'Bearer ' + user['accessToken'] };
        }
        else
            return {};
    }

    static getUserIdFromToken() {
        if(Object.keys(this.authHeader()).length === 0)
            return null;

        let url = AUTH_URL + "id"
        let config = {
            method: "get",
            url: url,
            headers: {...this.authHeader()}
        }
        console.log(config)
        return axios(config)
            .then((response) => {
                console.log("ID DATA")
                console.log(response);
                if (response.status === HttpStatusCodes.OK) {
                    return response.data;
                }
                else {
                    this.logout();
                    return null;
                }
            })
            .catch((e) => {
                this.logout(); // remove any old token if there is one.
                return null;
            })
    }

    static getUserFromId(email) {
        let url = AUTH_URL + "id";
        let data = {"id": email}
        let config = {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            data: data,
            url: url,
        }
        console.log(`URL ${url}`)
        console.log(config)
        return axios(config)
            .then((response) => {
                return response.data
            })
            .catch((e) => console.log(e))
    }
}

export default AuthService;
