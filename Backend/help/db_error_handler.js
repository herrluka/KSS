function handleDBError(res, error) {
    if (!error.parent) {
        return res.status(500).json({
            content: {
                message: 'Internal server error'
            }
        });
    }
    if (error.parent.code === 'ETIMEDOUT'){
        console.log(new Date().toISOString() + ' DB timeout');
        return res.status(500).json({
            content: {
                message: "DB timeout"
            }
        })
    } else {
        return res.status(500).json({
            content: {
                message: "Problem with DB."
            }
        })
    }
}

module.exports = handleDBError;