
const UserAccount = require('../model/userAccount');
const bcrypt = require('bcrypt');

class Site {
    //[GET] /index
    index(req, res) {
        const user = req.user;
        res.render('home', {user: user.toObject()});
    } 


    facultyIndex(req, res) {
        const user = req.user;
        res.render('faculty/facultyPage', {user: user.toObject()});
    } 
    
    // [GET] edit UserAccount

    edit(req, res, next) {
        
        UserAccount.findOne({_id: req.params.id})
            .then(acc => {
                res.render('editUserAccount', {user: acc.toObject()});
            })
            .catch(err => {

            })
    }

    update(req, res, next) {
        if (!req.file) {
            req.body.avatar = '';
        }
        else {
            req.body.avatar = req.file.path.split('\\').slice(2).join('\\');
        };
        let password = '';
        let {email, fullname, faculty, avatar, thematic, level, gender} = req.body;

        UserAccount.findOne({_id: req.params.id})
            .then(acc=> {
                password = acc.password;
                if (avatar == '') {
                    avatar = acc.avatar;
                }
                if (!gender) {
                    gender = acc.gender;
                }
                if (!level) {
                    level = acc.level;
                };
                if (!thematic) {
                    thematic = acc.thematic;
                };

                const newUser = {email: email, password: password, gender: gender, fullname: fullname, level: level, faculty: faculty, thematic: thematic, avatar: avatar}
                UserAccount.updateOne({_id: req.params.id}, newUser)
                    .then(() => {
                        if (req.user.level === 'admin') {
                            res.redirect('/admin/users')
                        }
                        else  {
                            res.redirect('/profile')
                        }
                    })
                    .catch(err => {

                    })
            })
            .catch(err => {
                res.send(err.message)
            })
    }

    showProfile(req, res) {
        let user = req.user;
        res.render('profile',{user: user.toObject()});
    }

    editPassword(req, res) {
        let error = req.app.get('err');
        UserAccount.findOne({_id: req.params.id})
            .then(acc => {
                res.render('changePassWord', {user: acc.toObject(), error: error});
            })
            .catch(err => {
                res.send(err.message);
            })
    }

    updatePassword(req, res) {
        let {oldPassword, password} = req.body;
        
        let account = undefined;

        UserAccount.findOne({_id: req.params.id})
            .then(acc => {
                if (!acc) {
                    req.app.set('err', 'Tài khoản không đúng')
                    return res.redirect(`/${req.params.id}/editPassword`);
                }
                account = acc;
                return bcrypt.compare(oldPassword, acc.password);
            })
            .then(match => {
                if (!match) {
                    req.app.set('err', 'Mật khẩu cũ không chính xác')
                    return res.redirect(`/${req.params.id}/editPassword`);
                }
                return bcrypt.hash(password, 10);
               
            })
            .then(hashed => {
                account.password = hashed;
                UserAccount.updateOne({_id: req.params.id}, account)
                    .then(acc => {
                        res.redirect('/profile');
                    })
                    .catch(err => {
                        res.send(err.message);
                    })
            })
            .catch(err => {
                res.send(err.message);
            })
        
        
    }
}

module.exports = new Site;
