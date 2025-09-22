import mongoose from 'mongoose';

const RecommendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: String,
    editor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' },
  },
  { timestamps: true }
);

export const Recommend = mongoose.model('Recommend', RecommendSchema);
