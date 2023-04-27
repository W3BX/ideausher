const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
  });
  
  module.exports = mongoose.model('posts', postSchema);