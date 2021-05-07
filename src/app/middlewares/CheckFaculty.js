module.exports = function CheckFaculty(req, res, next) {
    const level = req.user.level;

    if (level === 'faculty') {
        next();
    }
    else {
        res.send("NOT PERMISSION");
    }
}