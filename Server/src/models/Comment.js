import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    news: { type: mongoose.Schema.Types.ObjectId, ref: 'News' },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
