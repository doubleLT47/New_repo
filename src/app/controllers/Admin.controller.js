
const bcrypt = require('bcrypt');
const UserAccount = require('../model/userAccount');

const {validationResult} = require('express-validator');

class Admin {
    //[GET] /index
    index(req, res) {
        const user = req.user;
        res.render('admin/adminPage', {user: user.toObject()});
    } 

    //[GET] /users

    showAllUsers(req, res, next) {
        UserAccount.find({})
            .then(accs => res.render('admin/allUsers', {users: accs.map(acc => acc.toObject())}))
            .catch(next);
    }
    //[DELETE] /:id
    deleteOneUser (req, res, next) {
        UserAccount.deleteOne({_id: req.params.id})
            .then(() => res.redirect('/admin/users'));
    }
    //[GET] register
    register (req, res, next) {
        let error = req.app.get('error');
        res.render('admin/register', {error});
    }
    //[POST] /admin/register
    handleRegister (req, res) {
        let result = validationResult(req);
        if (result.errors.length === 0) {
            if (!req.file) {
                req.app.set('error', 'Chưa chọn avatar hoặc avatar không phải dạng ảnh!');
                return res.redirect('/admin/register');
            }
            req.body.avatar = req.file.path.split('\\').slice(2).join('\\');
    
            let {email, fullname, faculty, avatar, password, thematic} = req.body;
            let gender = '', level = 'faculty';
            UserAccount.findOne({email: email})
                .then(acc => {
                    if (acc) {
                        req.app.set('error', 'Email này đã tồn tại');
                        res.redirect('/admin/register');
                    }
                })
                .then(()=> bcrypt.hash(password, 10))  
                .then(hashed => {
                    let user = new UserAccount({email: email, password: hashed, gender: gender, fullname: fullname, level: level, faculty: faculty, thematic: thematic, avatar: avatar});
                    return user.save();
                })
                .then(() => res.redirect('/admin/users'))
                .catch(err => {
                    req.app.set('error', err)
                    res.redirect('/admin/register')
                })
               
        }
        else {
            let messages = result.mapped();
            let message = '';
            for (let m in messages) {
                message = messages[m].msg;
                break;
            }
            req.app.set('error', message)
            return res.redirect('/admin/register');
        }

    }

}

module.exports = new Admin;
