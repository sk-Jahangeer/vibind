const Joi = require("joi");
const moment = require("moment");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const validId = mongoose.Types.ObjectId.isValid(req.user._id);
    if (!validId) return res.status(400).send("Invalid token");

    const user = await User.findOne({ _id: req.user._id }).select("-password");
    if (!user) return res.status(400).send("Invalid token");

    const data = {
      username: user.username,
      email: user.email,
      mobile: user.mobile ? user.mobile : "",
      gender: user.gender,
      dateOfBirth: user.dateOfBirth
        ? moment(user.dateOfBirth).format("YYYY-MM-DD")
        : "",
    };

    res.send(data);
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});

router.post("/", auth, async (req, res) => {
  try {
    let data = req.body;
    const { error } = validate(data);
    if (error) return res.status(400).send(error.details[0].message);

    const validId = mongoose.Types.ObjectId.isValid(req.user._id);
    if (!validId) return res.status(400).send("Invalid token");

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("Invalid token");

    if (data.mobile === "") delete data.mobile;
    if (data.dateOfBirth === "") delete data.dateOfBirth;

    await User.updateOne({ _id: user._id }, data);

    res.send("sucess");
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});

function validate(data) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(250).required(),
    mobile: Joi.string().min(10).max(10).allow(""),
    gender: Joi.string().valid("male", "female").required(),
    dateOfBirth: Joi.date().allow(""),
  });

  return schema.validate(data);
}

module.exports = router;
