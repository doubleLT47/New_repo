
const postModel = require('../model/posts');
const UserAccount = require('../model/userAccount');
const commentModel = require('../model/comments');


class Comment {
    //[GET] /index
    
    createComment(req, res, next) {
        console.log('abc'+req.body.content);
        let newComment = new commentModel(req.body);
        newComment.save()
            .then(() =>{
                res.status(200).json({message: 'Bình luận đã được gửi đến chính chủ thành công', newComment: newComment});
            })
            .catch(err =>{
                
            })
    }

    showListComment(req, res, next) {

       
        commentModel.find({postID: req.params.id})
            .then(comments => {
                let data = [];
                let i = comments.length;
                comments.map(async (cmt, index) => {
                    let acc = await UserAccount.findOne({_id: cmt.userID});
                    
                    let {_id, content,postID, userID, createAt} = cmt;
                    
                    let userName = acc.fullname, userAvatar = acc.avatar;
                    var obj = {_id, content, postID, userID, userName, userAvatar, createAt};
                    data.push(obj); 
                    if (index === i - 1) {
                        res.send(JSON.stringify(data));
                    }
                })
                
                
            })
            .catch((err)=> res.status(500).json({err: "Server not responding!"}));
    }
        
}



module.exports = new Comment;
