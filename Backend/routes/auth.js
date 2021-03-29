const express = require('express');
const router = express.Router();
const User = require('../models/user');
const asyncHandler = require('../help/async_handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');
const auth = require('../middlewares/auth_middleware');
const isAdmin = require('../middlewares/role_middleware');

router.post('/login',
    body('username').exists(),
    body('password').exists(),
    asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            content: {
                message: 'Bad body request'
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
        console.log('[/register]' + new Date().toISOString() + ' DB unavailable');
        return res.status(400).json({
            content: {
                message: "DB unavailable"
            }
        })
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
                    message: 'Bad body request'
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
        }).catch(e => {
            if (e.parent.code === 'ER_DUP_ENTRY'){
                return res.status(400).json({
                    content: {
                        message: 'Username already exists'
                    }
                })
            }
            console.log(e)
            console.log('[/register]' + new Date().toISOString() + ' DB unavailable');
            return res.status(400).json({
                content: {
                    message: "DB unavailable"
                }
            })
        });
}));

module.exports = router;