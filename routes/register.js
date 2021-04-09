const verifyEmail = require("../email/templates/verifyEmail");
const crypto = require("crypto");
const Token = require("../models/token");
const User = require("../models/user");
const hash = require("../utils/bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send("User with given email already exist!");

    user = new User({
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
    });

    user.password = await hash(user.password);
    await user.save();

    const token = crypto.randomBytes(32).toString("hex");
    await new Token({ userId: user._id, token: token }).save();
    await verifyEmail(user, token);

    res.send("sucess");
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});

function validate(data) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(250).required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid("male", "female").required(),
    password: Joi.string().min(6).max(1000).required(),
  });
  return schema.validate(data);
}

module.exports = router;
