import mongoose from 'mongoose';

const savedNewsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  news: { type: mongoose.Schema.Types.ObjectId, ref: 'News' },
  saved_at: { type: Date, default: Date.now },
});

export const SaveNews = mongoose.model('SaveNews', savedNewsSchema);
