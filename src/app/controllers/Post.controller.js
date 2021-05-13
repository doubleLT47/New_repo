
const postModel = require('../model/posts');
const UserAccount = require('../model/userAccount');
const commentModel = require('../model/comments');
const fs = require('fs-extra');


const PAGE_SIZE = 5;
const DIR = 'src/public/';

class Post {
    //[GET] /index
    
    createPost(req, res, next) {
        if (!req.file ) {
            req.body.image = '';
        }
        else {
            req.body.image = req.file.path.split('\\').slice(2).join('\\');
        }


        const {caption, image, thematic, video, userID} = req.body;

        let newPost = new postModel(req.body);
        newPost.save()
            .then(() =>{
                res.status(200).json({message: 'Viết bài thành công', newPost: newPost});
            })
            .catch(err =>{
                
            })
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
        
}



module.exports = new Post;
