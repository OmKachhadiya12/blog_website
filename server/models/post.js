const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        defaylt: Date.now()
    },
    updatedAt: {
        type: Date,
        defaylt: Date.now()
    }
});

const Post = mongoose.model('Post',postSchema);

module.exports = Post;