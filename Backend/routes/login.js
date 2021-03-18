const express = require('express');
const router = express.Router();
const Round = require('../models/round');

router.post('/', async (req, res) => {

    try {
         await Round.findAll().then(u => {
             u.map(res => {
                 console.log(res.id)
             })
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    res.status(200);
    res.send({
        'test': 'test'
    });
});

module.exports = router;