const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
    },
    // role1: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    // role2: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  },
  { timestamps: true }
);

const Status = mongoose.model("Status", statusSchema);

module.exports = { Status };
