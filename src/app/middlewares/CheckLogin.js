

const jwt = require('jsonwebtoken');

const UserAccount = require('../model/userAccount');

module.exports = function CheckLogin(req, res, next) {
    console.log(req.cookies.token);
    
    try {
        const {JWT_SECRET} = process.env;
        const token = req.cookies.token;
        if (jwt.verify(token, JWT_SECRET)) {
            const id = jwt.verify(token, JWT_SECRET);
            UserAccount.findOne({_id: id})
                .then(user => {
                    if (user) {
                        req.user = user;
                        next();
                    }
                    else {
                        res.send("NOT PERMISSION");
                    }
                })
                .catch(err => {

                })
            
        }
    }
    catch (err) {
        res.redirect('/auth/login')
    }
}