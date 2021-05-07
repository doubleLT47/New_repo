module.exports = function CheckAdminAndFaculty(req, res, next) {
    const level = req.user.level;

    if (level === 'admin' || level === 'faculty') {
        next();
    }
    else {
        res.send("NOT PERMISSION");
    }
}