
const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');

const checkEmail = require('../app/middlewares/CheckEmail')
const upload = multer({ dest: 'src/public/uploads/', fileFilter: (req,file,callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    }
    else callback(null, false);
    console.log(file);
}})

const authController = require('../app/controllers/Auth.controller');
require('../app/middlewares/Authentication');

router.get('/', (req, res) => {res.send('oke')});
router.get('/login', authController.login);
router.post('/login', authController.handleLogin);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), checkEmail, authController.handleGoogleLogin);
router.get('/updateProfile', authController.updateProfile);
router.post('/registerWithGoogle', upload.single('avatar'), authController.handleRegisterWithGoogle);

router.get('/logout', authController.logout);

module.exports = router;