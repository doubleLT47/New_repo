
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const Posts = new Schema({
    caption: {type: String, required: true},
    image: String,
    thematic: String,
    video: String,
    userID :String,
    createAt: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Posts', Posts);