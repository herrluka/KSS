module.exports = (req, res, next) => {
    if (req.admin) {
        next();
    } else {
        return res.status(404).json({
            content: {
                message: 'Page does not exist'
            }
        })
    }
};