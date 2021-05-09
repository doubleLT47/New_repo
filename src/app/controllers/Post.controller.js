
const postModel = require('../model/posts');
const UserAccount = require('../model/userAccount');


const PAGE_SIZE = 5;

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

    async showListPosts(req, res, next) {
        let data = [];
        let page = parseInt(req.query.page) || 1;
        var skip = (page -1)*PAGE_SIZE;
        // console.log(page, skip)
        // var count = parseInt(await postModel.count({}));
        
        // if (skip >= count-5 ) {
        //     console.log("true")
        //     return res.send(JSON.stringify(data));
        // }
        
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
