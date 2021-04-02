const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const authorizationMiddleware = require('../middlewares/role_middleware');
const handleDBError = require('../help/db_error_handler');

router.get('/',
    authenticationMiddleware,
    authorizationMiddleware,
    (req, res) => {
        User.findAll({
            attributes : ['id', 'ime', 'prezime', 'uloga']
        }).then(users => {
            return res.status(200).json({
                content: users
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
});

module.exports = router;