import axios from "../../api/axios";

function getAllReferees() {
    return axios.get('/referees');
}

function insertReferee(requestBody, token) {
    console.log(requestBody)
    return axios.post('/referees', requestBody, {headers: {authorization: token}});
}

export {
    getAllReferees,
    insertReferee
}