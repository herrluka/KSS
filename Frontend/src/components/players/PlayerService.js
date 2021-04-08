import axios from "../../api/axios";

function getPlayersByName(playerName) {
    return axios.get('/players?playerName=' + playerName);
}

function getPlayerById(playerId) {
    return axios.get('players/' + playerId);
}

function insertNewPlayer(requestBody) {
    return axios.post('/players', requestBody);
}

function updatePlayer(playerId, requestBody) {
    return axios.put('/players/' + playerId, requestBody);
}

function deletePlayer(playerId) {
    return axios.delete('/players/' + playerId);
}

export {
    getPlayersByName,
    getPlayerById,
    insertNewPlayer,
    updatePlayer,
    deletePlayer
}