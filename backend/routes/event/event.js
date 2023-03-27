const router = require("express").Router();

const authenticate = require("../../middleware/authenticate");

const Event = require("../../models/eventSchema");
const User = require("../../models/userSchema");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    // Get the family Id of the user
    const familyId = user.family;
    // Find all the users that belong to the given familyId
    const users = await User.find({ family: familyId });
    // Extract the user IDs from the user documents
    const userIds = users.map((user) => user._id);
    const events = await Event.find({
      createdBy: { $in: userIds }
    });

    const es = events.map((e) => ({
      start: e.start,
      end: e.end,
      title: e.title,
      id: e._id.toString(),
      createdBy: e.createdBy.toString()
    }))
    return res.status(200).json(es);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { title, start, end } = req.body
    const newEvent = new Event({
      title,
      start,
      end,
      createdBy: req.userId
    });
    const event = await newEvent.save();
    res.status(201).json({
      start: event.start,
      end: event.end,
      title: event.title,
      id: event._id.toString(),
      createdBy: event.createdBy.toString()
    });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { title, start, end } = req.body
  const { userId } = req;
  const updateObj = {
    title,
    start,
    end
  }
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "event not found" })
    }
    if (!((event.createdBy.toString()) === (userId.toString()))) {
      return res.status(401).json({ message: "you can only edit events created by you." })
    }
    const newEv = await Event.findByIdAndUpdate(id, updateObj, { new: true });
    return res.status(200).json({
      start: newEv.start,
      end: newEv.end,
      title: newEv.title,
      id: newEv._id.toString(),
      createdBy: newEv.createdBy.toString()
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { userId } = req;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "event not found" })
    }
    if (!((event.createdBy.toString()) === (userId.toString()))) {
      return res.status(401).json({ message: "you can only delete events created by you." })
    }
    await Event.findByIdAndRemove(id);
    return res.status(200).json({ message: "event has been deleted." });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
});

module.exports = router;
