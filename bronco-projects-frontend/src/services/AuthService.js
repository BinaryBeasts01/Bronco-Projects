import jwt_decode from "jwt-decode";

import axios, * as others from 'axios';

const API_URL = "http://localhost:8080/api/auth/";
const HttpStatusCodes = require("http-status-codes");

class AuthService {
    login(username, password) {
        let url = API_URL + "login";
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

    sendCode(email) {
        let url = API_URL + "verificationcode";
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

    verifyCode(email, code) {
        console.log("INSIDE VERIFY")
        let url = API_URL + "verification";
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
                if (response.status === HttpStatusCodes.ACCEPTED) {
                    return true;
                }
                else {
                    return false;
                }
            });
    }

    signUp(email, password, resumeFile, transcriptFile) {
        const FormData = require('form-data');
        let url = API_URL + "user";

        let data = new FormData();
        data.append("email", email);
        data.append("password", password);
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

    logout() {
        localStorage.removeItem("user");
    }

    checkJWTValid() {
        let isExpired = false;
        const token = localStorage.getItem('user');
        if(!token) return false;

        let decodedToken= jwt_decode(token);
        let dateNow = new Date();

        if(decodedToken.exp < dateNow.getTime())
            isExpired = true;
        return isExpired;
    }

    authHeader() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user['accessToken']) {
            return { Authorization: 'Bearer ' + user['accessToken'] };
        }
        else
            return {};
    }
}

export default AuthService;