import axios from "../../api/axios";

function getPlayersThatPlayInClub(clubId) {
    return axios.get('/clubs/' + clubId + '/players');
}

function insertContract(requestBody, token) {
    return axios.post('/contracts', requestBody, {headers: {authorization: token}});
}

function deleteContract(contractId, token) {
    return axios.delete('/contracts/' + contractId, {headers: {authorization: token}});
}

export {
    getPlayersThatPlayInClub,
    insertContract,
    deleteContract
}