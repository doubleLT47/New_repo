
class Faculty {
    //[GET] /index
    index(req, res) {
        const user = req.user;
        res.render('faculty/facultyPage', {user: user.toObject()});
    } 

 
}

module.exports = new Faculty;
