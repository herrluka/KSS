const express = require('express');
const router = express.Router();
const Referee = require('../models/referee');
const League = require('../models/league');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');

router.get('/', (req, res) => {
    Referee.findAll({
        attributes: ['id', 'ime', 'prezime'],
        include: {
            model: League,
            as: 'liga',
            attributes: ['id', 'naziv_lige']
        }
    }).then(referees => {
        return res.status(200).json({
            content: referees
        })
    }).catch(error => {
        return handleDBError(res, error);
    })
});

router.get('/:refereeId',
    authenticationMiddleware,
    isAdmin, (req, res) => {
    Referee.findOne({
        include: {
            model: League,
            as: 'liga',
            attributes: ['id', 'naziv_lige']
        },
        where: {
            id: req.params.refereeId
        }
    }).then(referee => {
        if (!referee) {
            return res.status(404).json({
                content: {
                    message: 'Referee with sent id not found'
                }
            })
        }
        return res.status(200).json({
            content: referee
        })
    }).catch(error => {
        return handleDBError(res, error);
    })
});

router.post('/',
    body('name').exists(),
    body('surname').exists(),
    body('address').exists(),
    body('phone_number').exists(),
    body('league_id').exists(),
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
        Referee.create({
            ime: req.body.name,
            prezime: req.body.surname,
            adresa: req.body.address,
            broj_telefona: req.body.phone_number,
            najvisa_liga: req.body.league_id
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

router.put('/:refereeId',
    body('name').exists(),
    body('surname').exists(),
    body('address').exists(),
    body('phone_number').exists(),
    body('league_id').exists(),
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
        Referee.findOne({
            where: {
                id: req.params.refereeId
            }
        }).then(referee => {
            if (!referee) {
                return res.status(404).json({
                    content: {
                        message: 'Referee with sent id not found'
                    }
                })
            }
            referee.update({
                ime: req.body.name,
                prezime: req.body.surname,
                adresa: req.body.address,
                broj_telefona: req.body.phone_number,
                najvisa_liga: req.body.league_id
            }).then(success => {
                return res.status(204).json();
            }).catch(error => {
                return handleDBError(res, error);
            });
        }).catch(error => {
            return handleDBError(res, error);
        });
    });

router.delete('/:refereeId',
    authenticationMiddleware,
    isAdmin,
    (req, res) => {
        Referee.destroy({
            where: {
                id: req.params.refereeId
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