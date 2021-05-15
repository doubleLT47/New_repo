const express = require('express');
const router = express.Router();

const notifyController = require('../app/controllers/Notify.controller');
const checkLogin = require('../app/middlewares/CheckLogin');

router.get('/department',checkLogin, notifyController.index);
router.get('/api', checkLogin, notifyController.showListNotice)
router.get('/api/:thematic', checkLogin, notifyController.showNotifyWithThematic)
router.get('/all',checkLogin, notifyController.viewNotify);
router.get('/:thematic',checkLogin, notifyController.viewNotifyWithThematic);
module.exports = router;