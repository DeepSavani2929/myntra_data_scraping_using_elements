// const puppeteer = require("puppeteer");
// const scrapeCategory = require("./scrapeCategory");
// const scrapeProduct = require("./scrapeProduct");
// const MyntraProduct = require("../models/productSchema");

// const HOME_URL = "https://www.myntra.com/";
// const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// const scrapeAllData = async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-blink-features=AutomationControlled",
//     ],
//   });

//   try {
//     const page = await browser.newPage();

//     // Anti-bot
//     await page.evaluateOnNewDocument(() => {
//       Object.defineProperty(navigator, "webdriver", {
//         get: () => undefined,
//       });
//     });

//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
//         "AppleWebKit/537.36 (KHTML, like Gecko) " +
//         "Chrome/122.0.0.0 Safari/537.36"
//     );

//     console.log("Opening Myntra home page...");
//     await page.goto(HOME_URL, {
//       waitUntil: "domcontentloaded",
//       timeout: 60000,
//     });

//     await delay(8000);

//     //  STEP 1: GET ALL CATEGORY URLS FROM HOME PAGE
//     const categoryUrls = await page.evaluate(() => {
//       return Array.from(
//         document.querySelectorAll(
//           ".desktop-navBlock a.desktop-categoryLink, .desktop-navBlock a.desktop-categoryName"
//         )
//       )
//         .map((a) => ({
//           name: a.innerText.trim(),
//           url: new URL(a.getAttribute("href"), location.origin).href,
//         }))
//         .filter((c) => c.url.includes("/men-")); // optional filter
//     });

//     console.log(` Categories found: ${categoryUrls.length}`);

//     for (const category of categoryUrls) {
//       try {
//         console.log(`\n Category: ${category.name}`);
//         console.log(`${category.url}`);

//         const productUrls = await scrapeCategory(page, category.url);
//         console.log(` Products found: ${productUrls.length}`);

//         for (const productUrl of productUrls) {
//           try {
//             const productData = await scrapeProduct(browser, productUrl);
//             if (!productData || !productData.productCode) continue;

//             const exists = await MyntraProduct.findOne({
//               productCode: productData.productCode,
//             }).lean();

//             if (exists) {
//               console.log("⏭ Already exists:", productData.productCode);
//               continue;
//             }

//             await MyntraProduct.create(productData);
//             console.log(" Saved:", productData.productName);

//             await delay(2500);
//           } catch (err) {
//             console.error(" Product failed:", err.message);
//           }
//         }
//       } catch (err) {
//         console.error(" Category failed:", err.message);
//       }
//     }

//     console.log("\n ALL CATEGORIES SCRAPED SUCCESSFULLY");
//   } catch (err) {
//     console.error("Scraping failed:", err.message);
//   } finally {
//     await browser.close();
//   }
// };

// module.exports = scrapeAllData;

const puppeteer = require("puppeteer");
const scrapeCategory = require("./scrapeCategory");
const scrapeProduct = require("./scrapeProduct");
const MyntraProduct = require("../models/productSchema");

const HOME_URL = "https://www.myntra.com/";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const scrapeAllData = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => undefined,
      });
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/122.0.0.0 Safari/537.36"
    );

    console.log("Opening Myntra home page...");
    await page.goto(HOME_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForSelector(".desktop-navBlock", {
      timeout: 30000,
    });

    await delay(3000);

    const tshirtCategory = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll(".desktop-navBlock a")
      );

      const tshirtLink = links.find(
        (a) =>
          a.getAttribute("href") &&
          a.getAttribute("href").includes("/men-tshirts")
      );

      if (!tshirtLink) return null;

      return {
        name: tshirtLink.innerText.trim(),
        url: new URL(tshirtLink.getAttribute("href"), location.origin).href,
      };
    });

    console.log("Category result:", tshirtCategory);

    if (!tshirtCategory) {
      throw new Error(" T-Shirts category not found in navigation");
    }

    console.log("\n CATEGORY SELECTED");
    console.log("Name:", tshirtCategory.name);
    console.log("URL :", tshirtCategory.url);

    const productUrls = await scrapeCategory(page, tshirtCategory.url);
    console.log(` Products found: ${productUrls.length}`);

    for (const productUrl of productUrls) {
      try {
        const productData = await scrapeProduct(browser, productUrl);
        if (!productData || !productData.productCode) continue;

        const exists = await MyntraProduct.findOne({
          productCode: productData.productCode,
        }).lean();

        if (exists) {
          console.log("Already exists:", productData.productCode);
          continue;
        }

        await MyntraProduct.create(productData);
        console.log(" Saved:", productData.productName);

        await delay(2500);
      } catch (err) {
        console.error("Product failed:", err.message);
      }
    }

    console.log("\n T-SHIRTS SCRAPING COMPLETED");
  } catch (err) {
    console.error("Scraping failed:", err.message);
  } finally {
    await browser.close();
  }
};

module.exports = scrapeAllData;
