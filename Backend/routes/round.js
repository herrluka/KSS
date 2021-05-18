const express = require('express');
const router = express.Router();
const Round = require('../models/round');
const Match = require('../models/match');
const Referee = require('../models/referee');
const User = require('../models/user');
const Club = require('../models/club');
const League = require('../models/league');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const authorizationMiddleware = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');
const sequelize = require('../database/connection');
const Sequelize = require('sequelize');

router.get('/:roundId/matches', (req, res) => {
    Match.findAll({
        include: [
            {
                model: Round,
                as: 'kolo',
                attributes: ['naziv', 'id'],
                include: [
                    {
                        model: League,
                        as: 'liga',
                        attributes: ['id', 'naziv_lige']
                    }
                ]
            },
            {
                model: Referee,
                as: 'prvi_sudija',
                attributes: ['id', 'ime', 'prezime']
            },
            {
                model: Referee,
                as: 'drugi_sudija',
                attributes: ['id', 'ime', 'prezime']
            },
            {
                model: Club,
                as: 'klub_A',
                attributes: ['id', 'naziv_kluba']
            },
            {
                model: Club,
                as: 'klub_B',
                attributes: ['id', 'naziv_kluba']
            },
            {
                model: User,
                as: 'korisnik',
                attributes: ['id', 'ime', 'prezime']
            },
        ],
        attributes: ['id', 'tim_A_koseva', 'tim_B_koseva', 'tim_A_id', 'tim_B_id', 'odlozeno', 'datum_odrzavanja', 'prvi_sudija_id', 'drugi_sudija_id', 'azurirao'],
        where: {
            kolo_id: req.params.roundId
        },
        order: ['datum_odrzavanja']
    }).then(matches => {
        if (matches.length === 0) {
            Round.findOne({
                where: {
                    id: req.params.roundId,
                },
                include: {
                    model: League,
                    as: 'liga',
                    attributes: ['id', 'naziv_lige']
                }
            }).then(round => {
                return res.status(200).json({
                    content: {
                        kolo: {
                            kolo_id: round.id,
                            naziv_kola: round.naziv,
                            naziv_lige: round.liga.naziv_lige
                        },
                        utakmice: []
                    }
                })
            }).catch(error => {
                return res.status(404).json({
                    content: {
                        message: 'Round with sent id not found'
                    }
                })
            });
        } else {
            let responseBody = {};
            responseBody.kolo = {
                kolo_id: matches[0].kolo.id,
                naziv_kola: matches[0].kolo.naziv,
                naziv_lige: matches[0].kolo.liga.naziv_lige
            };
            responseBody.utakmice = [];
            matches.forEach(match => {
                responseBody.utakmice.push({
                    id: match.id,
                    tim_A_koseva: match.tim_A_koseva,
                    tim_B_koseva: match.tim_B_koseva,
                    odlozeno: match.odlozeno,
                    zavrseno: match.zavrseno,
                    prvi_sudija: match.prvi_sudija_id===null?null:{
                        id: match.prvi_sudija?.id,
                        ime: match.prvi_sudija?.ime,
                        prezime: match.prvi_sudija?.prezime
                    },
                    drugi_sudija: match.drugi_sudija_id===null?null: {
                        id: match.drugi_sudija?.id,
                        ime: match.drugi_sudija?.ime,
                        prezime: match.drugi_sudija?.prezime
                    },
                    korisnik: match.azurirao===null?null: {
                        id: match.korisnik?.id,
                        ime: match.korisnik?.ime,
                        prezime: match.korisnik?.prezime
                    },
                    klub_A: match.tim_A_id===null?null:{
                        id: match.klub_A?.id,
                        ime: match.klub_A?.naziv_kluba
                    },
                    klub_B: match.tim_B_id===null?null:{
                        id: match.klub_B?.id,
                        ime: match.klub_B?.naziv_kluba
                    },
                    datum_odrzavanja: match.datum_odrzavanja
                });
            });
            return res.status(200).json({
                content: responseBody
            })
        }
    }).catch(error => {
        return handleDBError(res, error);
    })
});

router.get('/:roundId(\\d+)/referees',
    (req, res) => {
        const query = `select id, ime, prezime from Sudija where najvisa_liga in
                       (select id from Liga where rang >= 
                       (select rang from Kolo where id = ` + req.params.roundId + '))';
        sequelize.query(query, {type: Sequelize.QueryTypes.SELECT}).then(clubs => {
            return res.status(200).json({
                content: clubs
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });


router.post('',
    body('name').exists(),
    body("date_from").exists(),
    body("date_to").exists(),
    body("eliminate_phase").isBoolean(),
    body('league_id').isInt(),
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
        Round.create({
            naziv: req.body.name,
            datum_od: req.body.date_from,
            datum_do: req.body.date_to,
            liga_id: req.body.league_id,
            eliminaciona_faza: req.body.eliminate_phase,
        }).then(result => {
            let newRound = result.dataValues;
            newRound.id = result.null;
            if (newRound.datum_od) {
                newRound.datum_od = newRound.datum_od.toISOString().split('T')[0];
            }
            if (newRound.datum_do) {
                newRound.datum_do = newRound.datum_do.toISOString().split('T')[0];
            }

            return res.status(201).json({
                content: {
                    message: 'OK',
                    round: newRound
                }
            })
        }).catch(error => {
            if (error?.parent?.errno === 1452){
                return res.status(400).json({
                    content: {
                        message: 'League that you have selected does not exist'
                    }
                })
            }
            return handleDBError(res, error);
        })
    });

router.put('/:roundId',
    body('name').exists(),
    body("date_from").exists(),
    body("date_to").exists(),
    body("eliminate_phase").exists(),
    body('league_id').isInt(),
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
        Round.findOne({
            where: {
                id: req.params.roundId
            }
        }).then(round => {
            round.update({
                naziv: req.body.name,
                datum_od: req.body.date_from,
                datum_do: req.body.date_to,
                liga_id: req.body.league_id,
                eliminaciona_faza: req.body.eliminate_phase,
            }).then(success => {
                return res.status(204).json({
                    content: {
                        message: 'OK'
                    }
                })
            }).catch(error => {
                if (error.parent.errno === 1452){
                    return res.status(400).json({
                        content: {
                            message: 'League that you have selected does not exist'
                        }
                    })
                }
                return handleDBError(res, error);
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.delete('/:roundId',
    authenticationMiddleware,
    authorizationMiddleware,
    (req, res) => {
        Round.destroy({
            where: {
                id: req.params.roundId
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