const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Club = require('../models/club');
const Participation = require('../models/player_plays_in');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('',
    (req, res) => {
        const searchKey = req.query.playerName;
        if (searchKey) {
            Player.findAll({
                attributes: ['id', 'ime', 'prezime', 'datum_rodjenja'],
                where: {
                    ime: {
                        [Op.like]: '%' + searchKey + "%"
                    }
                }
            }).then(players => {
                return res.status(200).json({
                    content: players
                })
            }).catch(error => {
                handleDBError(res, error)
            })
        } else {
            Player.findAll({
                attributes: ['id', 'ime', 'prezime', 'datum_rodjenja'],
            }).then(players => {
                return res.status(200).json({
                    content: players
                })
            }).catch(error => {
                handleDBError(res, error)
            })
        }
    });

router.get('/:playerId',
    authenticationMiddleware,
    isAdmin,
    (req, res) => {
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
            let responseBody = {};
            responseBody.igrac = {
                'ime': player.ime,
                'prezime': player.prezime,
                'datum_rodjenja': player.datum_rodjenja,
                'lekarski_pregled_datum': player.lekarski_pregled_datum
            };
            responseBody.klubovi = [];
            return res.status(200).json({
                content: responseBody
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
                if (error.parent.errno === 1644) {
                    return res.status(400).json({
                        content: {
                            message: 'Player is registered for 2 or more clubs, so he has to have more than 18 years.'
                        }
                    })
                }
                return handleDBError(res, error);
            });
        }).catch(error => {
            return handleDBError(res, error);
        });
    });

router.delete('/:playerId',
    authenticationMiddleware,
    isAdmin,
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