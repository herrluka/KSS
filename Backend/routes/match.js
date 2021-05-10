const express = require('express');
const router = express.Router();
const Match = require('../models/match');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');
const roles = require("../help/roles");

router.post('',
    body('team_A_points').exists(),
    body("team_B_points").exists(),
    body("date_played").exists(),
    body('first_referee_id').exists(),
    body('second_referee_id').exists(),
    body('team_A_id').exists(),
    body('team_B_id').exists(),
    body('round_id').isInt(),
    body('user_updated_id').exists(),
    body('isPostponed').isBoolean(),
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
        Match.create({
            tim_A_koseva: req.body.team_A_points,
            tim_B_koseva: req.body.team_B_points,
            tim_A_id: req.body.team_A_id,
            tim_B_id: req.body.team_B_id,
            odlozeno: req.body.isPostponed,
            prvi_sudija_id: req.body.first_referee_id,
            drugi_sudija_id: req.body.second_referee_id,
            kolo_id: req.body.round_id,
            azurirao: req.body.user_updated_id,
            datum_odrzavanja: req.body.date_played
        }).then(result => {
            let newMatch = result.dataValues;
            newMatch.id = result.null;
            return res.status(201).json({
                content: {
                    message: 'OK',
                    match: newMatch
                }
            })
        }).catch(error => {
            if (error.parent.errno === 1452){
                return res.status(400).json({
                    content: {
                        message: 'Foreign key error.'
                    }
                })
            }
            return handleDBError(res, error);
        })
    });

router.put('/:matchId',
    authenticationMiddleware,
    (req, res) => {
       if (req.role === roles.ADMIN) {
           if (req.body.team_A_points === undefined ||
               req.body.team_B_points === undefined ||
               req.body.date_played === undefined ||
               req.body.first_referee_id === undefined ||
               req.body.second_referee_id === undefined||
               req.body.team_A_id === undefined ||
               req.body.team_B_id === undefined ||
               req.body.round_id === undefined ||
               req.body.user_updated_id === undefined ||
               req.body.isPostponed === undefined) {
               return res.status(422).json({
                   content: {
                       message: 'Bad request body'
                   }
               })
           }
       } else if (req.role === roles.DELEGATE) {
           if (req.body.team_A_points === undefined ||
               req.body.team_B_points === undefined ||
               req.body.user_updated_id === undefined) {
               return res.status(422).json({
                   content: {
                       message: 'Bad request body'
                   }
               })
           }
       }
        Match.findOne({
            where: {
                id: req.params.matchId
            }
        }).then(match => {
            match.update({
                tim_A_koseva: req.body.team_A_points,
                tim_B_koseva: req.body.team_B_points,
                tim_A_id: req.body.team_A_id,
                tim_B_id: req.body.team_B_id,
                odlozeno: req.body.isPostponed,
                prvi_sudija_id: req.body.first_referee_id,
                drugi_sudija_id: req.body.second_referee_id,
                kolo_id: req.body.round_id,
                azurirao: req.body.user_updated_id,
                datum_odrzavanja: req.body.date_played
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
                            message: 'Foreign key error.'
                        }
                    })
                }
                return handleDBError(res, error);
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
    });

router.delete('/:matchId',
    authenticationMiddleware,
    isAdmin,
    (req, res) => {
        Match.destroy({
            where: {
                id: req.params.matchId
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