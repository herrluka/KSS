const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            content: {
                message: 'Not authorized'
            }
        })
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            content: {
                message: 'Token not provided'
            }
        })
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
        if (err) {
            return res.status(401).json({
                content: {
                    message: 'Token not valid'
                }
            })
        } else {
            req.userId = result.id;
            req.role = result.role;
            next();
        }
    });
};