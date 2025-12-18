const router = require("express").Router();
const scrapeProductDetails = require("./scrapeProductsData.js");
router.use("/scrapeMyntraData", scrapeProductDetails);
module.exports = router;
