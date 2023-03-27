const router = require("express").Router();
const authenticate = require("../../middleware/authenticate");
const Location = require("../../models/locationSchema");
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
    let locations = await Location.find({ createdBy: { $in: userIds } });
    locations = locations.map((t) => {
      return {
        id: t._id,
        address: t.address,
        lat: t.lat,
        long: t.long,
        createdBy: t.createdBy,
        createdAt: t.createdAt
      };
    });
    for (let i = 0; i < locations.length; i++) {
      const t = locations[i];
      const userName = (await User.findById(t.createdBy)).name;
      locations[i].userName = userName;
    }
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { address, lat, long } = req.body
    const newLocation = new Location({
      address,
      createdBy: req.userId,
      lat,
      long,
    });
    const savedLocation = await newLocation.save();
    res.status(200).json(savedLocation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { userId } = req;
  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: "location not found" })
    }
    if (!((location.createdBy.toString()) === (userId.toString()))) {
      return res.status(401).json({ message: "you can only delete locations created by you." })
    }
    await Location.findByIdAndRemove(id);
    return res.status(200).json({ message: "location has been deleted." });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
});

module.exports = router;
