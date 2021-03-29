const roles = require("../help/roles");

module.exports = (req, res, next) => {
    if (req.role === roles.ADMIN) {
        next();
    } else {
        return res.status(404).json({
            content: {
                message: 'Url does not exist'
            }
        })
    }
};