

class Notify {
    index(req,res){
        let user = req.user;
        return res.render('notifies/facultyList', {user: user.toObject()});
    }

    viewAllNotify(req,res){
        let user = req.user;
        return res.render('notifies/allNotify', {user: user.toObject()});
    }
  
    
}

module.exports = new Notify;
