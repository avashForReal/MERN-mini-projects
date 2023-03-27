const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema(
  {
    photo: {
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

const Gallery = mongoose.model("GALLERY", gallerySchema);

module.exports = Gallery;
