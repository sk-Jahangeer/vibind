const mongoose = require("mongoose");
const Joi = require("joi");
const crypto = require("crypto");
const User = require("../models/user");
const Token = require("../models/token");
const verifyEmail = require("../email/templates/verifyEmail");
const resetEmail = require("../email/templates/resetEmail");
const express = require("express");
const router = express.Router();

router.get("/account/:userId/:token", async (req, res) => {
  try {
    const userId = req.params.userId;
    const token = req.params.token;

    const validId = mongoose.Types.ObjectId.isValid(userId);
    if (!validId) return res.status(400).send("Invalid link or expired");

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send("Invalid link or expired");

    const verifiedToken = await Token.findOne({ userId: userId, token: token });
    if (!verifiedToken) return res.status(400).send("Invalid link or expired");

    if (!user.isVerified) {
      await User.updateOne({ _id: user._id }, { isVerified: true });
      await verifiedToken.deleteOne();
    }

    res.send("sucess");
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});

router.post("/resend-email", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User with given email not exist!");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      const hash = crypto.randomBytes(32).toString("hex");
      token = await new Token({ userId: user._id, token: hash }).save();
    }

    if (req.body.emailType === "verifyEmail" && !user.isVerified) {
      await verifyEmail(user, token.token);
      return res.send("sucess");
    }

    if (req.body.emailType === "resetEmail") {
      await resetEmail(user, token.token);
      return res.send("sucess");
    }
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});

function validate(data) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    emailType: Joi.string().valid("verifyEmail", "resetEmail").required(),
  });
  return schema.validate(data);
}

module.exports = router;
