const mongoose = require("mongoose");
const { MONGO_URL } = process.env;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log("Database connection failed!", error);
  });
