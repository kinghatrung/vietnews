import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
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
    source: {
      type: String,
    },
    like: {
      type: Number,
      default: 0,
    },
    likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    viewedIPs: [
      {
        ip: String,
        viewedAt: Date,
      },
    ],
    commentCount: { type: Number, default: 0 },
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  },
  { timestamps: true }
);
newsSchema.index({ title: 'text', describe: 'text' });

export const News = mongoose.model('News', newsSchema);
