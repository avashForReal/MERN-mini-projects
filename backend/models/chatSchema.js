const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("CHAT", chatSchema);
module.exports = Chat;
