import axios from "../../api/axios";

function getPlayersByName(playerName) {
    return axios.get('/players?playerName=' + playerName);
}

function getPlayerById(playerId, _token) {
    return axios.get('players/' + playerId, {headers: {Authorization: _token}});
}

function insertNewPlayer(requestBody, _token) {
    return axios.post('/players', requestBody, {headers: {Authorization: _token}});
}

function updatePlayer(playerId, requestBody, _token) {
    return axios.put('/players/' + playerId, requestBody, {headers: {Authorization: _token}});
}

function deletePlayer(playerId, _token) {
    return axios.delete('/players/' + playerId, {headers: {Authorization: _token}});
}

export {
    getPlayersByName,
    getPlayerById,
    insertNewPlayer,
    updatePlayer,
    deletePlayer
}