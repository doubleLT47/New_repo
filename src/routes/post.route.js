const express = require('express');
const router = express.Router();
const multer = require('multer');


const postController = require('../app/controllers/Post.controller');
const checkLogin = require('../app/middlewares/CheckLogin');

const upload = multer({ dest: 'src/public/uploads/', fileFilter: (req,file,callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    }
    else callback(null, false);
}})

router.post('/:id', checkLogin, upload.single('image'), postController.createPost);
router.get('/api', checkLogin, postController.showListPosts);
router.delete('/:id', checkLogin, postController.deleteOnePost)


module.exports = router;