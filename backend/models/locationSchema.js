const mongoose = require("mongoose");

const locationSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lat: {
      type: String,
      require: true,
    },
    long: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("LOCATION", locationSchema);
module.exports = Location;
