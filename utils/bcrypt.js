const bcrypt = require("bcrypt");

const hash = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  return await bcrypt.hash(password, salt);
};

module.exports = hash;
