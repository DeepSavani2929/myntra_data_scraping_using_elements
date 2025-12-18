const scrapeAllData = require("../controllers/scrapeAllData.js");
const router = require("express").Router();

router.post("/scrapeProductData", scrapeAllData);
module.exports = router;
