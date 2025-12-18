require("dotenv").config();
require("./config/dbConnect.js");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;
const router = require("./routes/index.js");

app.use("/api", router);
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
