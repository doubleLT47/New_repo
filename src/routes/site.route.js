
const express = require('express');
const router = express.Router();
const multer = require('multer');


const checkLogin = require('../app/middlewares/CheckLogin');
const siteController = require('../app/controllers/Site.controller');
const checkAdminAndFaculty = require('../app/middlewares/CheckAdminAndFaculty');

const upload = multer({ dest: 'src/public/uploads/', fileFilter: (req,file,callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    }
    else callback(null, false);
    console.log(file);
}})

router.get('/', checkLogin, siteController.index);
router.get('/:id/edit', checkLogin, siteController.edit);
router.put('/:id',checkLogin, upload.single('avatar'), siteController.update);
router.get('/profile', checkLogin, siteController.showProfile);
router.get('/:id/editPassword', checkLogin, siteController.editPassword);
router.patch('/:id', checkLogin, siteController.updatePassword);

module.exports = router;
