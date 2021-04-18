import axios from "../../api/axios";

function getMatchesByRoundId(roundId) {
    return axios.get("/rounds/" + roundId + "/matches");
}

function insertMatch(requestBody, token) {
    return axios.post("/matches", requestBody, {headers: {authorization: token}});
}

function updateMatch(matchId, requestBody, token) {
    return axios.put("/matches/" + matchId, requestBody, {headers: {authorization: token}});
}

function deleteMatch(matchId, token) {
    return axios.delete("/matches/" + matchId, {headers: {authorization: token}});
}

export {
    getMatchesByRoundId,
    insertMatch,
    updateMatch,
    deleteMatch
}