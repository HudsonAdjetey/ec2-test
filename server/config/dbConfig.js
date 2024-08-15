// Configuring DATABASE
const mongoose = require("mongoose");
require("dotenv").config();

const connDB = async () => {
  const URL =
    "mongodb+srv://ikobDev:edVUZLNyGQn7dz5H@atlascluster.5ilbo3m.mongodb.net/learniverse?retryWrites=true&w=majority";
  try {
    const conn = await mongoose.connect(URL, {
      // useNewUrlParser: true,
    });
    // if (process.env.NODE_ENV == "development") {
    //   console.log(`MongoDB connected: ${conn.connection.host}`);
    // }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = { connDB };
