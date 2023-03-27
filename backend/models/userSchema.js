const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    // confirmPassword: {
    //   type: String,
    //   required: true,
    //   min: 8,
    // },
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
    },
    // token: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

const User = mongoose.model("USER", userSchema);

module.exports = User;
