import axios from "../../api/axios";

function getUsers(token) {
    return axios.get('/users', {headers: {authorization: token}})
}

function getUserById(userId, token) {
    return axios.get('/users/' + userId , {headers: {authorization: token}})
}

function saveUser(requestBody, token) {
    return axios.post('/auth/register', requestBody, {headers: {authorization: token}})
}
function updateUser(userId, requestBody, token) {
    return axios.patch('/users/' + userId, requestBody, {headers: {authorization: token}})
}

function deleteUser(userId, token) {
    return axios.delete('/auth/unregister/' + userId, {headers: {authorization: token}})
}

function changePassword(userId, requestBody, token) {
    return axios.patch('/auth/change-password/' + userId, requestBody, {headers: {authorization: token}})
}

export {
    getUsers,
    getUserById,
    saveUser,
    updateUser,
    deleteUser,
    changePassword
}