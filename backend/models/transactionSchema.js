const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true,
  },
  amount: {
    type: Number,
    required: [true, "Add a positive or negative number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction = mongoose.model("TRANSACTION", transactionSchema);
module.exports = Transaction;
