const express = require('express');
const router = express.Router();

const notifyController = require('../app/controllers/Notify.controller');
const checkLogin = require('../app/middlewares/CheckLogin');

router.get('/department',checkLogin, notifyController.index);
router.get('/all',checkLogin, notifyController.viewAllNotify);
module.exports = router;