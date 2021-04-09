const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 3,
    maxLength: 250,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 1000,
    required: true,
  },
  mobile: {
    type: String,
    index: { unique: true, sparse: true },
    minLength: 10,
    maxLength: 10,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username, email: this.email },
    process.env.JWTPRIVATEKEY
  );
  return token;
};

module.exports = mongoose.model("user", userSchema);
