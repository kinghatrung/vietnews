const mongoose = require('mongoose');

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

const Role = mongoose.model('Role', roleSchema);

module.exports = { Role };
