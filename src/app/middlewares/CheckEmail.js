
module.exports = function CheckEmail(req, res, next) {
    const {email} = req.body;

    if (email.search('@student.tdtu.edu.vn') < 0) {
        req.app.set('err', 'Tài khoản phải là tài khoản sinh viên trường Tôn Đức Thắng')
        return res.redirect('/auth/login');
    }
    next();
}