const express = require('express');
const router = express.Router();
const Round = require('../models/round');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const authorizationMiddleware = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');

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