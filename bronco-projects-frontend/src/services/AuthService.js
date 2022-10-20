import jwt_decode from "jwt-decode";

const axios = require("axios");
const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "login", { "username": username, "password": password })
            .then((response) => {
                if (response.data['accessToken']) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    return response.data
                }
                else {
                    throw "Unable to Login"
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
            return { Authorization: 'Bearer ' + user.accessToken };
        }
        else
            return {};
    }
}

export default AuthService;