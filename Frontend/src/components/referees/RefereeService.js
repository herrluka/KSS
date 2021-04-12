import axios from "../../api/axios";

function getAllReferees() {
    return axios.get('/referees');
}

function getRefereeById(refereeId, token) {
    return axios.get('/referees/' + refereeId, {headers: {authorization: token}});
}

function insertReferee(requestBody, token) {
    return axios.post('/referees', requestBody, {headers: {authorization: token}});
}

function updateReferee(refereeId, requestBody, token) {
    return axios.put('/referees/' + refereeId, requestBody, {headers: {authorization: token}});
}

function deleteReferee(refereeId, token) {
    return axios.delete('/referees/' + refereeId, {headers: {authorization: token}});
}

export {
    getAllReferees,
    getRefereeById,
    insertReferee,
    updateReferee,
    deleteReferee
}