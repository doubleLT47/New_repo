

class Notify {
    //[GET] /index
    index(req, res, next) {
        res.render('profile');
    }
    
}

module.exports = new Notify;
