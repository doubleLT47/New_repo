const express = require('express');
const router = express.Router();
const multer = require('multer');

const adminController = require('../app/controllers/Admin.controller');
const checkLogin = require('../app/middlewares/CheckLogin');
const checkAdmin = require('../app/middlewares/CheckAdmin');

const upload = multer({ dest: 'src/public/uploads/', fileFilter: (req,file,callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    }
    else callback(null, false);
    console.log(file);
}})

router.get('/',checkLogin, checkAdmin, adminController.index);
router.get('/users',checkLogin, checkAdmin, adminController.showAllUsers);
router.get('/register',checkLogin, checkAdmin, adminController.register)
router.post('/register',checkLogin, checkAdmin, upload.single('avatar'), adminController.handleRegister);
router.delete('/:id',checkLogin, checkAdmin, adminController.deleteOneUser);

router.get('/posts',checkLogin, checkAdmin, adminController.showAllPosts);
router.get('/notifications',checkLogin, checkAdmin, adminController.showAllNotifications);
router.get('/comments',checkLogin, checkAdmin, adminController.showAllComments);


module.exports = router;