const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const handleDBError = require('../help/db_error_handler');
const {body, validationResult} = require('express-validator');

router.get('/',
    authenticationMiddleware,
    isAdmin,
    (req, res) => {
        User.findAll({
            attributes : ['id', 'ime', 'prezime', 'korisnicko_ime', 'uloga']
        }).then(users => {
            return res.status(200).json({
                content: users
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
});

router.get('/:id',
    authenticationMiddleware,
    isAdmin,
    (req, res) => {
        User.findOne({
            where: {
                id: req.params.id
            },
            attributes : ['id', 'ime', 'prezime']
        }).then(user => {
            if (!user) {
                return res.status(404).json({
                    content: {
                        message: 'User with sent id not found'
                    }
                })
            }
            return res.status(200).json({
                content: user
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.patch('/:userId',
    body('name').exists(),
    body('surname').exists(),
    body('role').exists(),
    authenticationMiddleware,
    isAdmin,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                content: {
                    message: 'Bad request body'
                }
            })
        }
        User.findOne({
            where: {
                id: req.params.userId
            }
        }).then(user => {
            if (!user) {
                return res.status(404).json({
                    content: {
                        message: 'User with sent id not found'
                    }
                })
            }
            user.update({
                ime: req.body.name,
                prezime: req.body.surname,
                uloga: req.body.role,
            }).then(success => {
                return res.status(204).json({
                    content: {
                        message: "OK"
                    }
                });
            }).catch(error => {
                return handleDBError(res, error);
            })
        }).catch(error => {
            return handleDBError(res, error)
        });
    });

module.exports = router;