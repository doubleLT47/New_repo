
const postModel = require('../model/posts');
const UserAccount = require('../model/userAccount');

class Post {
    //[GET] /index
    
    createPost(req, res, next) {
        if (!req.file ) {
            req.body.image = '';
        }

        req.body.image = req.file.path.split('\\').slice(2).join('\\');

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
        postModel.find({})
            .then(posts => {
                let data = [];
                let i = posts.length;
                posts.map(async (post, index) => {
                    let acc = await UserAccount.findOne({_id: post.userID});
                    
                    let {_id, caption,image, thematic, userID, createAt} = post;
                    
                    let userName = acc.fullname, userAvatar = acc.avatar;
                    var obj = {_id, caption, image, thematic, userID, createAt, userName, userAvatar};
                    data.push(obj); 
                    if (index === i - 1) {
                        res.send(JSON.stringify(data));
                    }
                })
                
                
            })
            .catch((err)=> res.status(500).json({err: "Server not responding!"}));
    }
        
}



module.exports = new Post;
