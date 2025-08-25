const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    describe: {
      type: String,
    },
    content: {
      type: String,
    },
    note: {
      type: String,
    },
    image: {
      type: String,
    },
    source: {
      type: String,
    },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    editor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = { Article };
