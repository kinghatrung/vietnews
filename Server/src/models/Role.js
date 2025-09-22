import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      maxLength: 50,
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model('Role', roleSchema);
