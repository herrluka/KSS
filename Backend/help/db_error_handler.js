function handleDBError(res, error) {
    if (!error.parent) {
        console.log(error);
        res.status(500).json({
            content: {
                message: 'Internal server error'
            }
        });
        res.send({
        });
    }
    if (error.parent.code === 'ETIMEDOUT'){
        console.log(new Date().toISOString() + ' DB timeout');
        return res.status(400).json({
            content: {
                message: "DB timeout"
            }
        })
    } else {
        console.log(error);
        return res.status(400).json({
            content: {
                message: "Problem with DB."
            }
        })
    }
}

module.exports = handleDBError;