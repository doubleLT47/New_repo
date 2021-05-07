const express = require('express');
const router = express.Router();

const commentController = require('../app/controllers/Comment.controller');

const checkLogin = require('../app/middlewares/CheckLogin');

router.post('/api',checkLogin, commentController.createComment);
router.get('/api/:id',checkLogin, commentController.showListComment)

module.exports = router;