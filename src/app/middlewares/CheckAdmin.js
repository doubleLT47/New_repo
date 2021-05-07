module.exports = function CheckAdmin(req, res, next) {
    const level = req.user.level;

    if (level === 'admin') {
        next();
    }
    else {
        res.send("NOT PERMISSION");
    }
}