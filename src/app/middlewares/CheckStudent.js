module.exports = function CheckStudent(req, res, next) {
    const level = req.user.level;

    if (level === 'student') {
        next();
    }
    if (level === 'admin') {
        res.redirect('/admin');
    }
    if (level === 'faculty') {
        res.redirect('/faculty');
    }
    
}