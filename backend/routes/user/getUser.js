const router = require("express").Router();
const authenticate = require("../../middleware/authenticate");

const Family = require("../../models/familySchema");
const User = require("../../models/userSchema");

// Get user's own information
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "family",
      model: Family,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      name: user.name,
      email: user.email,
      familyName: user.family.familyName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user information" });
  }
});

// Get information of users in the same family
router.get("/family", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "family",
      model: Family,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const family = await Family.findById(user.family._id).populate({
      path: "users",
      model: User,
    });
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    const users = family.users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      familyName: family.familyName,
    }));
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user information" });
  }
});

//get information of one user in the same family
router.get("/:famuserid", authenticate, async (req, res) => {
  try {
    const { famuserid } = req.params;
    const user = await User.findById(req.userId).populate({
      path: "family",
      model: Family,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const family = await Family.findById(user.family._id).populate({
      path: "users",
      model: User,
    });
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    const users = family.users.map((user) => ({
      name: user.name,
      email: user.email,
      familyName: family.familyName,
    }));
    const u = family.users.find((m) => (m._id.toString()) === famuserid)
    if (!u) {
      return res.status(404).json({ message: "Family member not found" })
    }
    res.json({
      name: u.name,
      email: u.email,
      id: u._id.toString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user information" });
  }
});

module.exports = router;
