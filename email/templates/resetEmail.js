const sendEmail = require("../sendEmail");
const baseUrl = process.env.BASE_URL;

const resetEmail = async (user, token) => {
  const link = `${baseUrl}/password-reset/${user._id}/${token}`;

  return await sendEmail(
    user.email,
    "Reset password",
    `click on the link to reset your password ${link}. This link is valid only for 1 hour.`
  );
};

module.exports = resetEmail;
