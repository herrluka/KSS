const express = require('express');
const router = express.Router();
const League = require('../models/league');
const Round = require('../models/round');
const Match = require('../models/match');
const Club = require('../models/club');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('',
    (req, res) => {
        League.findAll().then(leagues => {
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
            if (rounds.length === 0) {
                return res.status(404).json({
                    content: {
                        message: 'League with sent id not found'
                    }
                })
            }
            let responseBody = {};
            responseBody.liga = {
                liga_id: rounds[0].liga.id,
                naziv_lige: rounds[0].liga.naziv_lige
            };
            responseBody.kola = [];
            let roundsIds = [];
            rounds.forEach(round => {
                if (!round.eliminaciona_faza) {
                    roundsIds.push(round.id);
                }
               responseBody.kola.push({
                   id: round.id,
                   naziv: round.naziv,
                   datum_od: round.datum_od,
                   datum_do: round.datum_do,
                   eliminaciona_faza: round.eliminaciona_faza,
                   liga_id: round.liga_id,
               });
            });
            Match.findAll({
                where: {
                    kolo_id: {
                        [Op.in]: roundsIds,
                    }
                },
                include: [
                    {
                        model: Club,
                        as: 'klub_A',
                        attributes: ['naziv_kluba']
                    }
                ]
            }).then(matches => {
                responseBody.rang_lista = calculateWinsAndLosesForClubs(matches);
                return res.status(200).json({
                    content: responseBody
                })
            }).catch(error => {
                return handleDBError(res, error);
            });
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
            rang: req.body.rank
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

function calculateWinsAndLosesForClubs(matches) {
    let clubsDictionary = {};
    matches.forEach(match => {
        clubsDictionary[match.tim_A_id] = {
            wins: 0,
            loses: 0,
            total_points: 0,
            club_name: match.klub_A.naziv_kluba
        }
    });

    matches.forEach(match => {
        if (match.tim_A_koseva > match.tim_B_koseva) {
            clubsDictionary[match.tim_A_id]['wins'] += 1;
            clubsDictionary[match.tim_B_id]['loses'] += 1;
        } else if (match.tim_A_koseva < match.tim_B_koseva) {
            clubsDictionary[match.tim_A_id]['loses'] += 1;
            clubsDictionary[match.tim_B_id]['wins'] += 1;
        }
        clubsDictionary[match.tim_A_id]['total_points'] += match.tim_A_koseva;
        clubsDictionary[match.tim_B_id]['total_points'] += match.tim_B_koseva;
    });

    let standingsList = [];
    for (const [key, value] of Object.entries(clubsDictionary)) {
        standingsList.push(value);
    }
    return standingsList;
}

module.exports = router;
