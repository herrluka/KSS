const express = require('express');
const router = express.Router();
const League = require('../models/league');
const Round = require('../models/round');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');

router.get('',
    (req, res) => {
        League.findAll({
            attributes: ['id', 'naziv_lige']
        }).then(leagues => {
            return res.status(200).json({
                content: leagues
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.get('/:leagueId/rounds',
    (req, res) => {
        Round.findAll({
            include: [
                {
                    model: League,
                    as: 'liga'
                }
            ],
            where: {
                liga_id: req.params.leagueId
            },
            order: ['datum_od']
        }).then(rounds => {
            let responseBody = {};
            responseBody.liga = {
                liga_id: rounds[0].liga.id,
                naziv_lige: rounds[0].liga.naziv_lige
            };
            responseBody.kola = [];
            rounds.forEach(round => {
               responseBody.kola.push({
                   id: round.id,
                   naziv: round.naziv,
                   datum_od: round.datum_od,
                   datum_do: round.datum_do
               });
            });
            return res.status(200).json({
                content: responseBody
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.post('',
    body('name').exists(),
    body("rank").isInt(),
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
        League.create({
            naziv_lige: req.body.name,
            igrac_id: req.body.player_id
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

router.put('/:leagueId',
    body('name').exists(),
    body("rank").isInt(),
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
        League.findOne({
            where: {
                id: req.params.leagueId
            }
        }).then(league => {
            if (!league) {
                return res.status(404).json({
                    content: {
                        message: 'League with sent id not found'
                    }
                })
            }
            league.update({
                naziv_lige: req.body.name,
                rang: req.body.rank
            }).then(success => {
                return res.status(204).json({
                    content: {
                        message: 'OK'
                    }
                })
            }).catch(error => {
                return handleDBError(res, error);
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.delete('/:leagueId',
    authenticationMiddleware,
    isAdmin, (req, res) => {
    League.destroy({
        where: {
            id: req.params.leagueId
        }
    }).then(success => {
        return res.status(200).json({
            content: {
                message: 'OK'
            }
        })
    }).catch(error => {
        return handleDBError(res, error);
    })
});

module.exports = router;
