
const bcrypt = require('bcrypt');
const UserAccount = require('../model/userAccount');
const postModel = require('../model/posts');
const commentModel = require('../model/comments');
const notificationModel = require('../model/notifications');

const {validationResult} = require('express-validator');

class Admin {
    //[GET] /index
    index(req, res) {
        const user = req.user;
        res.render('admin/adminPage', {user: user.toObject()});
    } 

    //[GET] /users

    showAllUsers(req, res, next) {
        let user = req.user;
        UserAccount.find({})
            .then(accs => res.render('admin/allUsers', {users: accs.map(acc => acc.toObject()), user: user.toObject()}))
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
        let user = req.user;
        res.render('admin/register', {error, user: user.toObject()});
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

    showAllPosts(req, res, next) {

        postModel.find({})
        .then(posts => {
            
            let data = [];
            let i =posts.length;
            if (i !== 0) {
                posts.map(async (post, index) => {
                
                    let acc = await UserAccount.findOne({_id: post.userID});
                    
                    let {_id, caption,image, video, thematic, userID, createAt} = post;
                    
                    let userName = acc.fullname, userEmail= acc.email;
                    var obj = {_id, caption, image, video, thematic, userID, createAt, userName, userEmail};
                    data.push(obj); 
                    if (index === i - 1) {
                        res.render('admin/allPosts', {posts: data});
                    }
                })
            }
            
        })
        .catch((err)=> res.status(500).json({err: "Server not responding!"}))
    }
    showAllComments(req, res, next) {
        let user = req.user;
        let data = [];
        commentModel.find({})
            .then((comments) => {
                comments.map(async (comment) => {
                    let acc = await UserAccount.findOne({_id: comment.userID});
                    let userName = acc.fullname, userEmail = acc.email;
                    let {_id, content, postID, userID,createAt} = comment;
                    let obj = {_id, content, postID, userID, createAt, userEmail, userName};
                    data.push(obj);
                    res.render('admin/allComments', {comments: data, user: user.toObject()})
                })
            })
            .catch(next);
    }

    showAllNotifications (req, res) {
        let user = req.user;
        notificationModel.find({})
            .then((notices) => res.render('admin/allNotifications', {notices: notices.map(notice => notice.toObject()), user: user.toObject()}))
    }

}

module.exports = new Admin;
