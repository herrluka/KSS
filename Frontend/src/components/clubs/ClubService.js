import axios from "../../api/axios";

function getClubs(token) {
    return axios.get('/clubs', {headers: {authorization: token}})
}

function saveCLub(requestBody, token) {
    return axios.post('/clubs', requestBody, {headers: {authorization: token}})
}

function updateClub(clubId, requestBody, token) {
    return axios.put('/clubs/' + clubId, requestBody, {headers: {authorization: token}})
}

function deleteClub(clubId, token) {
    return axios.delete('/clubs/' + clubId, {headers: {authorization: token}})
}

export {
    getClubs,
    saveCLub,
    updateClub,
    deleteClub,
}