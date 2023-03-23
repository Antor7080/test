// image upload require functions
const multer = require("multer");
const path = require("path");

// multer images upload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname.split(" ").join("-"));

  },

});

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {

      cb(null, true);
    } else {
      cb(new Error("only .jpg, .jpeg and .png are allowed."));
    }
  },
});