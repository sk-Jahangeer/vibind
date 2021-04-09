const sendEmail = require("../sendEmail");
const baseUrl = process.env.BASE_URL;

const verifyEmail = async (user, token) => {
  const link = `${baseUrl}/verify/account/${user._id}/${token}`;

  return await sendEmail(
    user.email,
    "Verify email to activate account",
    `click on the link to active your account on vibind ${link}. This link is valid only for 1 hour.`
  );
};

module.exports = verifyEmail;
