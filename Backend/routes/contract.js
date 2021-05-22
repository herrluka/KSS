const express = require('express');
const router = express.Router();
const Contract = require('../models/player_plays_in');
const authenticationMiddleware = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const {body, validationResult} = require('express-validator');
const handleDBError = require('../help/db_error_handler');

router.post('',
    body('contract_date').exists(),
    body('club_id').exists(),
    body('player_id').exists(),
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
        Contract.create({
            datum_angazovanja: req.body.contract_date,
            klub_id: req.body.club_id,
            igrac_id: req.body.player_id
        }).then(result => {
            let newContract =  result.dataValues;
            newContract.id = result.null;
            return res.status(201).json({
                content: {
                    message: 'OK',
                    contract: newContract
                }
            })
        }).catch(error => {
            if (error.parent.errno === 1452){
                return res.status(400).json({
                    content: {
                        code: 1,
                        message: 'Bad club or player id provided.'
                    }
                })
            } else if (error.parent.errno === 1644) {
                return res.status(400).json({
                    content: {
                        code: 2,
                        message: 'Player who is younger than 18 years cannot be registered for more than one club.'
                    }
                })
            } else if (error.parent.errno === 1602) {
                return res.status(400).json({
                    content: {
                        code: 3,
                        message: 'Contract already exists'
                    }
                })
            }
            return handleDBError(res, error);
        })
    });

router.patch('/:contractId',
    body('club_id').exists(),
    body('contract_date').exists(),
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
                if (error.parent.errno === 1452){
                    return res.status(400).json({
                        content: {
                            message: 'Bad club or player id provided.'
                        }
                    })
                } else if (error.parent.errno === 1644) {
                    return res.status(400).json({
                        content: {
                            message: 'Player who is younger than 18 years cannot be registered for more than one club.'
                        }
                    })
                }
                return handleDBError(res, error);
            })
        }).catch(error => {
            return handleDBError(res, error);
        })
});

router.delete('/:contractId',
    authenticationMiddleware,
    isAdmin,
    (req, res) => {
        Contract.destroy({
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