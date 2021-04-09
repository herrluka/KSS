import axios from "../../api/axios";

function getAllLeagues() {
    return axios.get('leagues');
}

function createLeague(requestBody, token) {
    return axios.post('leagues', requestBody, {headers: {authorization: token}});
}

function updateLeague(leagueId, requestBody, token) {
    return axios.put('leagues/' + leagueId, requestBody, {headers: {authorization: token}});
}

function deleteLeague(leagueId, token) {
    return axios.delete('leagues/' + leagueId, {headers: {authorization: token}});
}

export {
    getAllLeagues,
    createLeague,
    updateLeague,
    deleteLeague
};