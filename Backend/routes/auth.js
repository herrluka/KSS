const express = require('express');
const router = express.Router();
const User = require('../models/user');
const asyncHandler = require('../help/async_handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');
const auth = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');
const handleDBError = require('../help/db_error_handler');

router.post('/login',
    body('username').exists(),
    body('password').exists(),
    asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            content: {
                message: 'Bad request body'
            }
        })
    }

    let user = null;
    try {
         user = await User.findOne({
             where: {
                 korisnicko_ime: req.body.username
             }
         });
    } catch (error) {
        return handleDBError(res, error);
    }

    if(user){
        bcrypt.compare(req.body.password, user.lozinka).then(result => {
            if (result) {
                const token = jwt.sign({id: user.id, role: user.uloga}, process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRE_TIME
                });

                return res.status(200).json({
                    content: {
                        token: token,
                        name: user.ime
                    }
                })
            } else {
                return res.status(401).json({
                    content: {
                        message: 'Username or password is not correct'
                    }
                })
            }
        });

    } else {
        return res.status(401).json({
            content: {
                message: 'Username or password is not correct'
            }
        })
    }
}));

router.post('/register',
    body('first_name').exists(),
    body('last_name').exists(),
    body('username').exists(),
    body('password').exists(),
    body('role').exists(),
    auth,
    isAdmin,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                content: {
                    message: 'Bad request body'
                }
            })
        }
        const password = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT));

        User.create({
            ime: req.body.first_name,
            prezime: req.body.last_name,
            korisnicko_ime: req.body.username,
            lozinka: password,
            uloga: req.body.role
        }).then(result => {
            return res.status(201).json({
                content: {
                    message: "OK"
                }
            });
        }).catch(error => {
            if (error.parent.code === 'ER_DUP_ENTRY'){
                return res.status(400).json({
                    content: {
                        message: 'Username already exists'
                    }
                })
            } else {
                return handleDBError(res, error)
            }
        });
}));

router.patch('/change-password/:userId',
    body('password').exists(),
    auth,
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

        User.findOne({
            where: {
                id: req.params.userId
            }
        }).then(user => {
            if (!user) {
                return res.status(404).json({
                    content: {
                        message: 'User with sent id not found'
                    }
                })
            }
            bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT)).then(password => {
                    console.log('NAKON');
                    user.update({
                        lozinka: password
                    }).then(success => {
                        return res.status(204).json({
                            content: {
                                message: "OK"
                            }
                        });
                    }).catch(error => {
                        return handleDBError(res, error);
                    })
            }).catch(error => {
                return handleDBError(res, error);
            });
        }).catch(error => {
            return handleDBError(res, error)
        });
    });

router.delete('/unregister/:userId',
    auth,
    isAdmin,
    asyncHandler(async (req, res) => {
        User.destroy({
            where: {
                id: req.params.userId
            }
        }).then(user => {
            return res.status(200).json({
                content: {
                    message: "OK"
                }
            });
        }).catch(error => {
            return handleDBError(res, error)
        });
    }));

module.exports = router;