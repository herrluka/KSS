import axios from "../../api/axios";

function login(requestBody) {
    return axios.post('auth/login', requestBody);
}

export {
    login
};