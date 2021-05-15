
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const Notifications  = new Schema({
    postID: String,
    userName: String,
    hint: String,
    thematic: String,
    createAt: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Notifications ', Notifications );