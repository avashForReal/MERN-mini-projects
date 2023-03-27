const mongoose = require("mongoose");

const familySchema = mongoose.Schema({
  familyName: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Family = mongoose.model("FAMILY", familySchema);

module.exports = Family;
