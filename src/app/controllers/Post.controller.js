
const postModel = require('../model/posts');
const UserAccount = require('../model/userAccount');
const commentModel = require('../model/comments');
const notificationModel = require('../model/notifications');
const fs = require('fs-extra');


const PAGE_SIZE = 5;
const DIR = 'src/public/';

class Post {
    //[GET] /index
    
    async createPost(req, res, next) {
        if (!req.file ) {
            req.body.image = '';
        }
        else {
            req.body.image = req.file.path.split('\\').slice(2).join('\\');
        }

        let userName = '', pId = '';
        const {caption, image, thematic, video, userID} = req.body;

        let newPost = new postModel(req.body);
        await newPost.save();

        if (req.user.level === 'faculty') {
            let p = await postModel.findOne({caption, image, thematic, video, userID});
            pId = p._id, userName = req.user.fullname;

            console.log(pId, userName)

            let newNotices = new notificationModel({postID: pId, userName: userName, hint: caption, thematic: thematic});
            await newNotices.save();
        }
        res.status(200).json({message: 'Viết bài thành công', userName: userName, pId: pId});
    }

    showListPosts(req, res, next) {
        let data = [];
        let page = parseInt(req.query.page) || 1;
        var skip = (page -1)*PAGE_SIZE;
        
        
        postModel.find({})
            .sort({createAt: -1})
            .skip(skip)
            .limit(PAGE_SIZE)
            .then(posts => {                
                let i = posts.length;
                
                if (i === 0) {
                    res.send(JSON.stringify(data));
                }
                posts.map(async (post, index) => {
                    
                    let acc = await UserAccount.findOne({_id: post.userID});
                    
                    let {_id, caption,image, video, thematic, userID, createAt} = post;
                    
                    let userName = acc.fullname, userAvatar = acc.avatar;
                    var obj = {_id, caption, image, video, thematic, userID, createAt, userName, userAvatar};
                    data.push(obj); 
                    if (index === i - 1) {
                        res.send(JSON.stringify(data));
                    }
                })
            })
            .catch((err)=> res.status(500).json({err: "Server not responding!"}));
    }

    showListFacultyPosts(req, res, next) {
        let data = [];
        let page = parseInt(req.query.page) || 1;
        var skip = (page -1)*PAGE_SIZE;
        
        
        postModel.find({userID: req.params.id})
            .sort({createAt: -1})
            .skip(skip)
            .limit(PAGE_SIZE)
            .then(posts => {                
                let i = posts.length;
                
                if (i === 0) {
                    res.send(JSON.stringify(data));
                }
                posts.map(async (post, index) => {
                    
                    let acc = await UserAccount.findOne({_id: post.userID});
                    
                    let {_id, caption,image, video, thematic, userID, createAt} = post;
                    
                    let userName = acc.fullname, userAvatar = acc.avatar;
                    var obj = {_id, caption, image, video, thematic, userID, createAt, userName, userAvatar};
                    data.push(obj); 
                    if (index === i - 1) {
                        res.send(JSON.stringify(data));
                    }
                })
            })
            .catch((err)=> res.status(500).json({err: "Server not responding!"}));
    }

    async deleteOnePost(req, res) {
        let post = await postModel.findOne({_id: req.params.id});
        if (post.image !== '') {
            fs.removeSync(DIR+post.image);
        }

        postModel.deleteOne({_id: req.params.id})
            .then(() => {
                commentModel.deleteMany({postID: req.params.id})
                .then(() => {
                    console.log('oke khoong')
                    if (req.user.level === 'admin') {
                        res.redirect('/admin/posts');
                    }
                    else {
                        res.json({message: `Đã xóa bài post ${req.params.id} thành công`})
                    }
                })
                .catch((err) => res.status(500).json({err: "Cannot delete the post alo!"}))
               
            })
            .catch((err) => res.status(500).json({err: "Cannot delete the post oke!"}))
    }

    postDetail(req, res) {
        let user = req.user;
        console.log(req.params.id)
        postModel.findOne({_id: req.params.id})
            .then(async (p) => {
                let acc = await UserAccount.findOne({_id: p.userID});
                    
                let {_id, caption,image, video, thematic, userID, createAt} = p;
                    
                let userName = acc.fullname, userAvatar = acc.avatar;
                var obj = {_id, caption, image, video, thematic, userID, createAt, userName, userAvatar};
                res.render('detailPost', {user: user.toObject(), post: obj})
            })
            .catch((err) => res.status(500).json({err: "Cannot find post"}))
    }
        
}



module.exports = new Post;
