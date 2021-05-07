const bcrypt = require('bcrypt');
const UserAccount = require('../model/userAccount');
const jwt = require('jsonwebtoken');

const {validationResult} = require('express-validator');



class Auth {

    //[GET] login
    login(req, res) {
        let error = req.app.get('err');
        res.render('login', {layout: false, error: error});
    }

    //[POST] login
    handleLogin(req, res) {
        let result = validationResult(req);
        if (result.errors.length === 0) {
            let {email, password} = req.body;
            if (!email) {
                req.app.set('err', 'Đăng nhập thất bại!, Bạn chưa nhập Email!')
                return res.redirect('/auth/login');
            }
            if (!password) {
                req.app.set('err', 'Đăng nhập thất bại!, Bạn chưa nhập password!')
                return res.redirect('/auth/login');
            }
            let account = undefined;
            UserAccount.findOne({email: email})
                .then(acc => {
                    if (!acc) {
                        req.app.set('err', 'Đăng nhập thất bại!, Email hoặc mật khẩu không chính xác')
                        return res.redirect('/auth/login');
                    }
                    account = acc;
                    return bcrypt.compare(password, acc.password);
                })
                .then((passwordMatch) => {
                    if (!passwordMatch) {
                        req.app.set('err', 'Đăng nhập thất bại!, Email hoặc mật khẩu không chính xác')
                        return res.redirect('/auth/login');
                    }
                        req.app.set('err', '');
                    const {JWT_SECRET} = process.env;
                    const token = jwt.sign({_id: account._id}, JWT_SECRET);
                    res.cookie('token', token, {maxAge: 24 * 60 * 60 *10, httpOnly: true});
                    if (account.level === 'admin') {
                        return res.redirect('/admin');
                    }
                    if (account.level === 'faculty') {
                        return res.redirect('/faculty');
                    }
                })
                .catch(err => {
                    req.app.set('err', 'Đăng nhập thất bại!, Email hoặc mật khẩu không chính xác')
                    res.redirect('/auth/login');
                })
        }
        
    }


    handleGoogleLogin(req, res) {
        let email = req.user._json.email;
        // if (email.search('@student.tdtu.edu.vn') < 0) {
        //     req.app.set('err', 'Tài khoản phải là tài khoản sinh viên trường Tôn Đức Thắng')
        //     return res.redirect('/auth/login');
        // }
        UserAccount.findOne({email: email})
            .then(acc => {
                if (acc) {
                    const {JWT_SECRET} = process.env;
                    const token = jwt.sign({_id: acc._id}, JWT_SECRET);
                    res.cookie('token', token, {maxAge: 24 * 60 * 60 *10, httpOnly: true});
                    res.redirect('/');
                }
                else {
                    req.app.set("user", req.user);
                    res.redirect('/auth/updateProfile')
                }
            })  
            .catch(() => res.redirect('/auth/login') );     
    }

    updateProfile(req, res) {
        console.log(req.app.get('user'));
        let user = req.app.get('user');
        let error = req.app.get('error')
        res.render('updateProfile', {layout: false, user: user, error: error});
    }
    //[POST] registerWithGoogleAccount
    handleRegisterWithGoogle (req, res) {
        
        if (!req.file) {
            req.app.set('error', 'Chưa chọn avatar hoặc avatar không phải dạng ảnh!');
            return res.redirect('/auth/updateProfile');
        }
        req.body.avatar = req.file.path.split('\\').slice(2).join('\\');

        let {email,fullname, faculty, avatar,gender} = req.body;
        let password = '';
        let level = 'student';
        

        let newUser = new UserAccount({email, password, gender, fullname, level, faculty, avatar});
        
        newUser.save()
            .then((data) => {
                const {JWT_SECRET} = process.env;
                    const token = jwt.sign({_id: data._id}, JWT_SECRET);
                    res.cookie('token', token, {maxAge: 24 * 60 * 60 * 10, httpOnly: true});
                    res.redirect('/')
            })
            .catch(err => res.status(500).json({message: "Creating UserAccount failed!", err: err}))
        
    }
    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/auth/login')
    }
}

module.exports = new Auth;