const User = require("../../models/userSchema");
const Family = require("../../models/familySchema");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//CREATE FAMILY
router.post("/createFamily", async (req, res) => {
  try {
    const { name, email, password, familyName } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(401).json({
        message: "User with provided email already exists",
        status: false,
      });
    } else {
      // Saving Family Details
      const newFamily = await Family.create({ familyName });
      // Hashing Password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Saving User Details
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        family: newFamily._id,
      });
      //Update family document with new user id
      await Family.updateOne(
        { _id: newFamily._id },
        { $push: { users: newUser._id } }
      );

      await newUser.save();

      const user = {
        name: newUser.name,
        email: newUser.email,
        family: newUser.family,
        _id: newUser._id
      };

      //respond with success message
      return res.status(200).json({
        status: true,
        message: "User and family created."
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

//JOIN FAMILY
router.post("/joinFamily", async (req, res) => {
  try {
    const { name, email, password, familyId } = req.body;
    // check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(401).json({
        message: "User with provided email already exists.",
        status: false,
      });
    }
    // check if the family exists
    const checkFamily = await Family.findOne({ _id: familyId });
    if (!checkFamily) {
      return res.status(404).json({ message: "Family not found", status: false });
    }
    // Hashing Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      family: familyId,
    });
    //update family document with new user id
    await Family.updateOne(
      { _id: familyId },
      { $push: { users: newUser._id } }
    );

    // Update user document with token
    await newUser.save();
    res.json({
      message: "User created and joined to a family.",
      status: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
});

module.exports = router;
