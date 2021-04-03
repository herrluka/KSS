const express = require('express');
const router = express.Router();
const Round = require('../models/round');
const Match = require('../models/match');
const Referee = require('../models/referee');
const User = require('../models/user');
const Club = require('../models/club');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const authorizationMiddleware = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');

router.get('/:roundId/matches', (req, res) => {
    Match.findAll({
        include: [
            {
                model: Round,
                as: 'kolo',
                attributes: ['naziv', 'id']
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
        attributes: ['id', 'tim_A_koseva', 'tim_B_koseva', 'odlozeno', 'zavrseno', 'datum_odrzavanja'],
        where: {
            kolo_id: req.params.roundId
        },
        order: ['datum_odrzavanja']
    }).then(matches => {
        let responseBody = {};
        responseBody.kolo = {
            kolo_id: matches[0].kolo.id,
            naziv_kola: matches[0].kolo.naziv
        };
        responseBody.utakmice = [];
        matches.forEach(match => {
            responseBody.utakmice.push({
                id: match.id,
                tim_A_koseva: match.tim_A_koseva,
                tim_B_koseva: match.tim_B_koseva,
                odlozeno: match.odlozeno,
                zavrseno: match.zavrseno,
                prvi_sudija: {
                    id: match.prvi_sudija?.id,
                    ime: match.prvi_sudija?.ime,
                    prezime: match.prvi_sudija?.prezime
                },
                drugi_sudija: {
                    id: match.drugi_sudija?.id,
                    ime: match.drugi_sudija?.ime,
                    prezime: match.drugi_sudija?.prezime
                },
                azurirao: {
                    id: match.korisnik?.id,
                    ime: match.korisnik?.ime,
                    prezime: match.korisnik?.prezime
                },
                klub_A: {
                    id: match.klub_A?.id,
                    ime: match.klub_A?.naziv_kluba
                },
                klub_B: {
                    id: match.klub_B?.id,
                    ime: match.klub_B?.naziv_kluba
                },
                datum_odrzavanja: match.datum_odrzavanja
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
    body("date_from").exists(),
    body("date_to").exists(),
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
            liga_id: req.body.league_id
        }).then(success => {
            return res.status(201).json({
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
    });

router.put('/:roundId',
    body('name').exists(),
    body("date_from").exists(),
    body("date_to").exists(),
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
                liga_id: req.body.league_id
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