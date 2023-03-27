const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("TODO", todoSchema);
module.exports = Todo;
