const express = require('express');
const router = express.Router();
const Club = require('../models/club');
const Contract = require('../models/player_plays_in');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const authorizationMiddleware = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');

router.post('',
    body('contract_date').exists(),
    body('club_id').exists(),
    body('player_id').exists(),
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
        Contract.create({
            datum_angazovanja: req.body.contract_date,
            klub_id: req.body.club_id,
            player_id: req.body.player_id
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

router.patch('/:contractId',
    body('club_id').exists(),
    body('contract_date').exists(),
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
        Contract.findOne({
            where: {
                id: req.params.contractId
            }
        }).then(contract => {
            contract.update({
                klub_id: req.body.clubId,
                datum_angazovanja: req.body.contract_date
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

router.delete('/:contractID',
    authenticationMiddleware,
    authorizationMiddleware,
    (req, res) => {
        Contract.destory({
            where: {
                id: req.params.contractId
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