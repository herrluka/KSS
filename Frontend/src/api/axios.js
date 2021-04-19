import axios from "axios";

const instance = axios.create({
        baseURL: 'http://localhost:3000/',
        timeout: 5000
    }
);
instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        window.location.href = '/login';
    } else if (error.response.status === 404) {
        window.location.href = '/error';
    }
});

export default instance;