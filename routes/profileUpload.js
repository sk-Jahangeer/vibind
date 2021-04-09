const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const express = require("express");
const router = express.Router();

router.post("/", upload.single("avatar"), (req, res, next) => {
  try {
    res.json(req.file);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
