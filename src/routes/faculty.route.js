const express = require('express');
const router = express.Router();

const facultyController = require('../app/controllers/Faculty.controller');

const checkLogin = require('../app/middlewares/CheckLogin');
const checkFaculty = require('../app/middlewares/CheckFaculty');

router.get('/',checkLogin, checkFaculty, facultyController.index);


module.exports = router;