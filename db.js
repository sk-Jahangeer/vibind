const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;

module.exports = async function connection() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(DB_URL, connectionParams);
    console.log("connected to database.");
  } catch (error) {
    console.log(error);
    console.log("could not connected to database.");
  }
};
