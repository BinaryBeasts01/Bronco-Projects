import API_URL from "../constants/API_URL";
import AuthService from "./AuthService";
import axios from "axios";

const AUTH_URL = API_URL + "auth/";

const openResume = async (student) => {
    let user = await AuthService.getUserFromId(student);
    let resumeId = user["resumeFileId"];

    let url = AUTH_URL + "resume";
    let config = {
        method: "post",
        url: url,
        data: {id: resumeId},
        responseType: 'blob'
    }
    axios(config)
        .then((response) => {
            const file = new Blob([response.data], { type: "application/pdf" });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
        })
}

export default openResume;