
const postModel = require('../model/posts');

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
}

module.exports = new Post;
