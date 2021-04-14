import axios from "axios";

const instance = axios.create({
        baseURL: 'http://localhost:3000/',
        timeout: 5000
    }
);
instance.interceptors.response.use(response => {
    if (response.status === 401) {
        console.log('AUTH!');
    }
    return response;
});

export default instance;