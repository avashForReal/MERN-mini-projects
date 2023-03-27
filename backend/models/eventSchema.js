const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Event = mongoose.model("EVENTS", eventSchema);
module.exports = Event;
