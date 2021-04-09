const mongoose = require("mongoose");
const User = require("../models/user");
const Token = require("../models/token");
const hash = require("../utils/bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/:userId/:token", async (req, res) => {
  try {
    const userId = req.params.userId;
    const token = req.params.token;

    const validId = mongoose.Types.ObjectId.isValid(userId);
    if (!validId) return res.status(400).send("Invalid link or expired");

    const schema = Joi.string().min(6).max(1000).required();
    const { error } = schema.validate(req.body.password);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send("Invalid link or expired");

    const verifiedToken = await Token.findOne({ userId: userId, token: token });
    if (!verifiedToken) return res.status(400).send("Invalid link or expired");

    const hashPassword = await hash(req.body.password);
    await User.updateOne({ _id: user._id }, { password: hashPassword });
    await verifiedToken.deleteOne();

    if (!user.isVerified)
      await User.updateOne({ _id: user._id }, { isVerified: true });

    res.send("sucess");
  } catch (error) {
    console.log(error);
    res.send("An error occured");
  }
});

module.exports = router;
