const uploadMiddleware = require("../../middleware/multer");
const Gallery = require("../../models/gallerySchema");
const User = require("../../models/userSchema");

const authenticate = require("../../middleware/authenticate");

const router = require("express").Router();

router.post(
  "/",
  authenticate,
  uploadMiddleware.single("photo"),
  async (req, res) => {
    try {
      console.log(req.file)
      const photo = req.file.filename;

      console.log(photo);
      const newPhoto = new Gallery({
        photo,
        createdBy: req.userId,
      });

      await newPhoto.save();
      res.status(201).json(newPhoto);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    // Get the family Id of the user
    const familyId = user.family;
    // Find all the users that belong to the given familyId
    const users = await User.find({ family: familyId });
    // Extract the user IDs from the user documents
    const userIds = users.map((user) => user._id);
    // Find all the todos that were created by the extracted user IDs
    const photos = await Gallery.find({ createdBy: { $in: userIds } }).sort({
      createdAt: "descending",
    });
    res.status(200).json(photos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { userId } = req;
  try {
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({ message: "image not found" })
    }
    if (!((image.createdBy.toString()) === (userId.toString()))) {
      return res.status(401).json({ message: "you can only delete images created by you." })
    }
    await Gallery.findByIdAndRemove(id);
    return res.status(200).json({ message: "image has been deleted." });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
});

module.exports = router;
