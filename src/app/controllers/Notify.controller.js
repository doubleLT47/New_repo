
const notificationModel = require('../model/notifications');

class Notify {
    index(req,res){
        let user = req.user;
        return res.render('notifies/facultyList', {user: user.toObject()});
    }

    viewAllNotify(req,res){
        let user = req.user;
        notificationModel.find({})
            .sort({createAt: -1})
            .then((notifies) => {
                return res.render('notifies/allNotify', {user: user.toObject(), notices: notifies.map((notify) => notify.toObject())});
            })
    }
  
    
}

module.exports = new Notify;
