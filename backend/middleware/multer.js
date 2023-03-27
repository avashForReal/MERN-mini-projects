const multer = require("multer");

const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}_${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = fileTypes.test(file.mimetype)
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    return cb("Only images allowed!", false);
  }
};

const uploadMiddleware = multer({ storage, fileFilter });

module.exports = uploadMiddleware;
