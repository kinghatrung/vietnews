import mongoose from 'mongoose';

// User
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      maxLength: 50,
      unique: true,
    },
    password: {
      type: String,
      maxLength: 255,
    },
    email: {
      type: String,
      required: true,
      maxLength: 100,
      unique: true,
    },
    phone: {
      type: String,
      maxLength: 15,
    },
    savedNews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
      },
    ],
    address: {
      type: String,
      maxLength: 255,
    },
    birth_date: Date,
    gender: String,
    full_name: String,
    isActive: { type: Boolean, default: true },
    avatar: String,
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    banReason: {
      type: String,
      default: null,
    },
    banUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
