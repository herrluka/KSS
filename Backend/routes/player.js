const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const authorizationMiddleware = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');

router.get('/:playerId',
    authenticationMiddleware,
    authorizationMiddleware, (req, res) => {
        Player.findOne({
            where: {
                id: req.params.playerId
            }
        }).then(player => {
            if (!player) {
                return res.status(404).json({
                    content: {
                        message: 'Player with sent id not found'
                    }
                })
            }
            return res.status(200).json({
                content: player
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.post('/',
    body('name').exists(),
    body('surname').exists(),
    body('birth_date').exists(),
    body('medical_examination').exists(),
    authenticationMiddleware,
    authorizationMiddleware,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                content: {
                    message: 'Bad request body'
                }
            })
        }
        Player.create({
            ime: req.body.name,
            prezime: req.body.surname,
            datum_rodjenja: req.body.birth_date,
            lekarski_pregled_datum: req.body.medical_examination,
        }).then(success => {
            return res.status(201).json({
                content: {
                    message: 'OK'
                }
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.put('/:playerId',
    body('name').exists(),
    body('surname').exists(),
    body('birth_date').exists(),
    body('medical_examination').exists(),
    authenticationMiddleware,
    authorizationMiddleware,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                content: {
                    message: 'Bad request body'
                }
            })
        }
        Player.findOne({
            where: {
                id: req.params.playerId
            }
        }).then(player => {
            if (!player) {
                return res.status(404).json({
                    content: {
                        message: 'Player with sent id not found'
                    }
                })
            }
            player.update({
                ime: req.body.name,
                prezime: req.body.surname,
                datum_rodjenja: req.body.birth_date,
                lekarski_pregled_datum: req.body.medical_examination,
            }).then(success => {
                return res.status(204).json();
            }).catch(error => {
                return handleDBError(res, error);
            });
        }).catch(error => {
            return handleDBError(res, error);
        });
    });

router.delete('/:playerId',
    authenticationMiddleware,
    authorizationMiddleware,
    (req, res) => {
        Player.destroy({
            where: {
                id: req.params.playerId
            }
        }).then(success => {
            return res.status(200).json({
                content: {
                    message: 'OK'
                }
            });
        }).catch(error => {
            return handleDBError(res, error);
        });
    });

module.exports = router;