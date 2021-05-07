
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const Comments = new Schema({
    content: {type: String, required: true},
    postID: String,
    userID: String,
    createAt: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Comments', Comments);