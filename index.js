require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./db");
const path = require("path");
const cors = require("cors");

// routes
const register = require("./routes/register");
const login = require("./routes/login");
const user = require("./routes/user");
const emailVerify = require("./routes/emailVerify");
const passwordReset = require("./routes/passwordReset");
const profileUpload = require("./routes/profileUpload");

(async function () {
  await connection();
})();

app.use(express.json());
app.use(cors());

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/verify", emailVerify);
app.use("/api/password-reset", passwordReset);
app.use("/api/upload", profileUpload);
app.use("/api/me", user);

app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}.....`);
});
