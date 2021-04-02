function handleDBError(res, error) {
    if (error.parent.code === 'ETIMEDOUT'){
        console.log('[/register]' + new Date().toISOString() + ' DB timeout');
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