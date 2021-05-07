
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const UserAccount = new Schema({
    email: {type: String, required: true, unique: true},
    password: String,
    gender: String,
    fullname:  String,
    level: String,
    faculty: String,
    thematic: String,
    avatar: String,
    createAt: {type: Date, default: Date.now }
});

module.exports = mongoose.model('UserAccount', UserAccount);