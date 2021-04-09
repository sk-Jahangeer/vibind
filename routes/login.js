const User = require("../models/user");
const Token = require("../models/token");
const verifyEmail = require("../email/templates/verifyEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password) return res.status(400).send("Invalid email or password");

    if (!user.isVerified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        const hash = crypto.randomBytes(32).toString("hex");
        token = await new Token({ userId: user._id, token: hash }).save();
      }

      await verifyEmail(user, token.token);
      return res.send("verify_email");
    }

    const token = user.generateAuthToken();
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(400).send("An error occured");
  }
});

function validate(data) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(1000).required(),
  });
  return schema.validate(data);
}

module.exports = router;
