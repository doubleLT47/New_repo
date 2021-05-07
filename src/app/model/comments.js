
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const Comments = new Schema({
    content: {type: String, required: true},
    postId: String,
    createAt: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Comments', Comments);