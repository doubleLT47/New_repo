

class Notify {
    index(req,res){
        return res.render('facultyList');
    }

    viewAllNotify(req,res){
        return res.render('allNotify');
    }
  
    
}

module.exports = new Notify;
