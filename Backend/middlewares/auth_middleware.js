const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            content: 'Token not provided'
        })
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
        if (err) {
            return res.status(401).json({
                content: 'Token not valid'
            })
        } else {
            next();
        }
    });
};