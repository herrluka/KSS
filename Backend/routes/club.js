const express = require('express');
const router = express.Router();
const Club = require('../models/club');
const Participation = require('../models/player_plays_in');
const Player = require('../models/player');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');
const Sequelize = require('sequelize');

router.get('/', (req, res) => {
    Club.findAll().then(clubs => {
        return res.status(200).json({
            content: clubs
        })
    }).catch(error => {
        return handleDBError(res, error);
    })
});

router.get('/:clubId/players',
    (req, res) => {
        Participation.findAll({
            attributes: ['id', 'datum_angazovanja'],
            where: {
                klub_id: req.params.clubId
            },
            include: [
                {
                    model: Player,
                    as: 'igrac',
                    attributes: ['id', 'ime', 'prezime']
                },
                {
                    model: Club,
                    as: 'klub',
                    attributes: ['id', 'naziv_kluba']
                },
            ]
        }).then(participations => {
            if (participations.length === 0) {
                return res.status(404).json({
                    content: {
                        message: 'Club with sent id not found'
                    }
                })
            }
            let responseBody = {};
            responseBody.klub = {
                id: participations[0].klub.id,
                naziv_kluba: participations[0].klub.naziv_kluba,
            };
            responseBody.igraci_u_klubu = [];
            let playersInClubIds = [];
            participations.forEach(participation => {
                playersInClubIds.push(participation.igrac.id);
                responseBody.igraci_u_klubu.push({
                    id: participation.id,
                    igrac_id: participation.igrac.id,
                    ime: participation.igrac.ime,
                    prezime: participation.igrac.prezime,
                    datum_angazovanja: participation.datum_angazovanja,
                })
            });
            Player.findAll({
                attributes: ['id', 'ime', 'prezime'],
                where : {
                    id: {[Sequelize.Op.notIn]: playersInClubIds}
                }
            }).then(players => {
                responseBody.igraci_za_angazovanje = players;
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

router.get('/:clubId',
    authenticationMiddleware,
    isAdmin, (req, res) => {
        Club.findOne({
            where: {
                id: req.params.clubId
            }
        }).then(club => {
            if (!club) {
                return res.status(404).json({
                    content: {
                        message: 'Club with sent id not found'
                    }
                })
            }
            return res.status(200).json({
                content: club
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.post('/',
    body('name').exists(),
    body('foundation_year').exists(),
    body('address').exists(),
    body('phone_number').exists(),
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
        Club.create({
            naziv_kluba: req.body.name,
            godina_osnivanja: req.body.foundation_year,
            adresa_kluba: req.body.address,
            broj_telefona: req.body.phone_number,
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

router.put('/:clubId',
    body('name').exists(),
    body('foundation_year').exists(),
    body('address').exists(),
    body('phone_number').exists(),
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
        Club.findOne({
            where: {
                id: req.params.clubId
            }
        }).then(club => {
            if (!club) {
                return res.status(404).json({
                    content: {
                        message: 'Club with sent id not found'
                    }
                })
            }
            club.update({
                naziv_kluba: req.body.name,
                godina_osnivanja: req.body.foundation_year,
                adresa_kluba: req.body.address,
                broj_telefona: req.body.phone_number,
            }).then(success => {
                return res.status(204).json();
            }).catch(error => {
                return handleDBError(res, error);
            });
        }).catch(error => {
            return handleDBError(res, error);
        });
    });

router.delete('/:clubId',
    authenticationMiddleware,
    isAdmin,
    (req, res) => {
        Club.destroy({
            where: {
                id: req.params.clubId
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