var Account = require('../models/account');

var statuscheck = async (req, res, next) => {
    try{
        var account = await Account.findOne({"acctNumber": req.body.acctNumber})
        if (!account) {
            res.status(404).json({
                title: 'No Account found',
                error: {message: 'Account not found.'}
            });  
        }
    } catch (e) {
        res.status(500).json({
            title: 'An error occurred',
            error: e
        });  
    }
    
    if(account.acctStatus === "close") {
        return res.status(401).json({
            title: "Account had been closed",
            error: {message: 'Account is closed, no operation allowed.'}
        });
    }
    next();
}

module.exports = {statuscheck};