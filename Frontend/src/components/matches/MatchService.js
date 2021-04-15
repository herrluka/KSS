import axios from "../../api/axios";

function getMatchesByRoundId(roundId) {
    return axios.get("/rounds/" + roundId + "/matches");
}

export {
    getMatchesByRoundId,
}