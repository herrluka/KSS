import axios from "../../api/axios";

function getRoundsByLeagueId(leagueId) {
    return axios.get('/leagues/' + leagueId + '/rounds');
}

function createRound(requestBody, token) {
    return axios.post('/rounds/', requestBody, {headers: {authorization: token}});
}

function updateRound(roundId, requestBody, token) {
    return axios.put('/rounds/' + roundId, requestBody, {headers: {authorization: token}});
}

function deleteRound(roundId, token) {
    return axios.delete('/rounds/' + roundId, {headers: {authorization: token}});
}

export {
    getRoundsByLeagueId,
    createRound,
    updateRound,
    deleteRound
}