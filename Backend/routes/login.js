const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {

    res.status(200);
    res.send({
        'test': 'test'
    });
});

module.exports = router;