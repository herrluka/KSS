import axios from "../../api/axios";

function getAll() {
    return axios.get('leagues');
}

export {
    getAll
};