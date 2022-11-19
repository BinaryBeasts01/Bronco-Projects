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

    static checkJWTValid() {
        let isExpired = false;
        const token = localStorage.getItem('user');
        if(!token) return false;

        let decodedToken= jwt_decode(token);
        let dateNow = new Date();

        if(decodedToken.exp < dateNow.getTime())
            isExpired = true;
        return isExpired;
    }

    static authHeader() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user['accessToken']) {
            return { Authorization: 'Bearer ' + user['accessToken'] };
        }
        else
            return {};
    }
}

export default AuthService;
