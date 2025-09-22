import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      maxLength: 100,
    },
    description: {
      type: String,
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    news: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
      },
    ],
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);
