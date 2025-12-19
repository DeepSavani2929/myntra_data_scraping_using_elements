//scrapped data:- For Tshirts category only
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

//     await page.waitForSelector(".desktop-navBlock", {
//       timeout: 30000,
//     });

//     await delay(3000);

//     const tshirtCategory = await page.evaluate(() => {
//       const links = Array.from(
//         document.querySelectorAll(".desktop-navBlock a")
//       );

//       const tshirtLink = links.find(
//         (a) =>
//           a.getAttribute("href") &&
//           a.getAttribute("href").includes("/men-tshirts")
//       );

//       if (!tshirtLink) return null;

//       return {
//         name: tshirtLink.innerText.trim(),
//         url: new URL(tshirtLink.getAttribute("href"), location.origin).href,
//       };
//     });

//     console.log("Category result:", tshirtCategory);

//     if (!tshirtCategory) {
//       throw new Error(" T-Shirts category not found in navigation");
//     }

//     console.log("\n CATEGORY SELECTED");
//     console.log("Name:", tshirtCategory.name);
//     console.log("URL :", tshirtCategory.url);

//     const productUrls = await scrapeCategory(page, tshirtCategory.url);
//     console.log(` Products found: ${productUrls.length}`);

//     for (const productUrl of productUrls) {
//       try {
//         const productData = await scrapeProduct(browser, productUrl);
//         if (!productData || !productData.productCode) continue;

//         const exists = await MyntraProduct.findOne({
//           productCode: productData.productCode,
//         }).lean();

//         if (exists) {
//           console.log("Already exists:", productData.productCode);
//           continue;
//         }

//         await MyntraProduct.create(productData);
//         console.log(" Saved:", productData.productName);

//         await delay(2500);
//       } catch (err) {
//         console.error("Product failed:", err.message);
//       }
//     }

//     console.log("\n T-SHIRTS SCRAPING COMPLETED");
//   } catch (err) {
//     console.error("Scraping failed:", err.message);
//   } finally {
//     await browser.close();
//   }
// };

// module.exports = scrapeAllData;

//Scrapped data:- for all the categories

// const puppeteer = require("puppeteer");
// const scrapeCategory = require("./scrapeCategory");
// const scrapeProduct = require("./scrapeProduct");
// const MyntraProduct = require("../models/productSchema");

// const HOME_URL = "https://www.myntra.com/";
// const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// async function openMenMenu(page) {
//   const menSelector = 'a.desktop-main[data-group="men"]';
//   await page.waitForSelector(menSelector, { timeout: 15000 });
//   await page.hover(menSelector);
//   await page.waitForSelector('.desktop-categoryContainer[data-group="men"]', {
//     timeout: 15000,
//   });
//   await delay(1200);
// }

// async function clickMenMenuItem(page, label) {
//   await openMenMenu(page);

//   const clicked = await page.evaluate((text) => {
//     const links = Array.from(
//       document.querySelectorAll(
//         '.desktop-categoryContainer[data-group="men"] a'
//       )
//     );
//     const link = links.find((a) => a.innerText.trim() === text);
//     if (!link) return false;
//     link.click();
//     return true;
//   }, label);

//   if (!clicked) {
//     throw new Error(`Menu item not found: ${label}`);
//   }

//   await page.waitForNavigation({
//     waitUntil: "domcontentloaded",
//     timeout: 60000,
//   });

//   await delay(3000);
// }

// async function getMenMenu(page) {
//   return page.evaluate(() => {
//     const container = document.querySelector(
//       '.desktop-categoryContainer[data-group="men"]'
//     );
//     if (!container) return [];

//     return Array.from(container.querySelectorAll(".desktop-navBlock"))
//       .map((block) => {
//         const parent = block.querySelector(".desktop-categoryName");
//         if (!parent) return null;

//         return {
//           parentName: parent.innerText.trim(),
//           subCategories: Array.from(
//             block.querySelectorAll(".desktop-categoryLink")
//           ).map((a) => a.innerText.trim()),
//         };
//       })
//       .filter(Boolean);
//   });
// }

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

//     console.log("Opening Myntra...");
//     await page.goto(HOME_URL, {
//       waitUntil: "domcontentloaded",
//       timeout: 60000,
//     });

//     await delay(6000);

//     await openMenMenu(page);
//     const menuTree = await getMenMenu(page);

//     console.log(`MEN menu groups found: ${menuTree.length}`);

//     for (const group of menuTree) {
//       console.log(`\nPARENT CATEGORY: ${group.parentName}`);

//       try {
//         console.log(`  Clicking parent: ${group.parentName}`);

//         await clickMenMenuItem(page, group.parentName);

//         const parentUrl = page.url();
//         const parentProducts = await scrapeCategory(page, parentUrl);

//         console.log(`  Parent products: ${parentProducts.length}`);

//         for (const productUrl of parentProducts) {
//           const productData = await scrapeProduct(browser, productUrl);
//           if (!productData || !productData.productCode) continue;

//           const exists = await MyntraProduct.findOne({
//             productCode: productData.productCode,
//           }).lean();

//           if (!exists) {
//             await MyntraProduct.create(productData);
//             console.log("   Saved (parent):", productData.productName);
//           }
//         }

//         await page.goto(HOME_URL, { waitUntil: "domcontentloaded" });
//         await delay(4000);
//       } catch (err) {
//         console.error(" Parent scrape failed:", err.message);
//       }

//       for (const subName of group.subCategories) {
//         try {
//           console.log(`  Subcategory: ${subName}`);

//           await clickMenMenuItem(page, subName);

//           const subUrl = page.url();
//           const productUrls = await scrapeCategory(page, subUrl);

//           console.log(`   Sub products: ${productUrls.length}`);

//           for (const productUrl of productUrls) {
//             const productData = await scrapeProduct(browser, productUrl);
//             if (!productData || !productData.productCode) continue;

//             const exists = await MyntraProduct.findOne({
//               productCode: productData.productCode,
//             }).lean();

//             if (!exists) {
//               await MyntraProduct.create(productData);
//               console.log("    Saved (sub):", productData.productName);
//             }
//           }

//           await page.goto(HOME_URL, { waitUntil: "domcontentloaded" });
//           await delay(4000);
//         } catch (err) {
//           console.error(" Subcategory scrape failed:", err.message);
//         }
//       }
//     }

//     console.log("\nALL MEN PARENT & SUBCATEGORIES SCRAPED");
//   } catch (err) {
//     console.error("Scraping failed:", err.message);
//   } finally {
//     await browser.close();
//   }
// };

// module.exports = scrapeAllData;




// const puppeteer = require("puppeteer");
// const scrapeCategory = require("./scrapeCategory");
// const scrapeProduct = require("./scrapeProduct");
// const MyntraProduct = require("../models/productSchema");

// const HOME_URL = "https://www.myntra.com/";
// const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// async function openMenMenu(page) {
//   const menSelector = 'a.desktop-main[data-group="men"]';
//   await page.waitForSelector(menSelector, { timeout: 15000 });
//   await page.hover(menSelector);
//   await page.waitForSelector('.desktop-categoryContainer[data-group="men"]', {
//     timeout: 15000,
//   });
//   await delay(1200);
// }

// async function clickMenMenuItem(page, label) {
//   await openMenMenu(page);

//   const clicked = await page.evaluate((text) => {
//     const links = Array.from(
//       document.querySelectorAll(
//         '.desktop-categoryContainer[data-group="men"] a'
//       )
//     );
//     const link = links.find((a) => a.innerText.trim() === text);
//     if (!link) return false;
//     link.click();
//     return true;
//   }, label);

//   if (!clicked) throw new Error(`Menu item not found: ${label}`);

//   await page.waitForNavigation({
//     waitUntil: "domcontentloaded",
//     timeout: 60000,
//   });

//   await delay(3000);
// }

// async function getMenMenu(page) {
//   return page.evaluate(() => {
//     const container = document.querySelector(
//       '.desktop-categoryContainer[data-group="men"]'
//     );
//     if (!container) return [];

//     return Array.from(container.querySelectorAll(".desktop-navBlock"))
//       .map((block) => {
//         const parent = block.querySelector(".desktop-categoryName");
//         if (!parent) return null;

//         return {
//           parentName: parent.innerText.trim(),
//           subCategories: Array.from(
//             block.querySelectorAll(".desktop-categoryLink")
//           ).map((a) => a.innerText.trim()),
//         };
//       })
//       .filter(Boolean);
//   });
// }

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

//     await page.evaluateOnNewDocument(() => {
//       Object.defineProperty(navigator, "webdriver", {
//         get: () => undefined,
//       });
//     });

//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122 Safari/537.36"
//     );

//     await page.goto(HOME_URL, { waitUntil: "domcontentloaded" });
//     await delay(6000);

//     await openMenMenu(page);
//     const menuTree = await getMenMenu(page);

//     for (const group of menuTree) {
//       console.log(`\nPARENT: ${group.parentName}`);

//       // ✅ Parent category
//       await clickMenMenuItem(page, group.parentName);
//       const parentProducts = await scrapeCategory(page);

//       for (const url of parentProducts) {
//         const data = await scrapeProduct(browser, url);
//         if (!data?.productCode) continue;

//         const exists = await MyntraProduct.findOne({
//           productCode: data.productCode,
//         });

//         if (!exists) await MyntraProduct.create(data);
//       }

//       await page.goto(HOME_URL, { waitUntil: "domcontentloaded" });
//       await delay(4000);

//       for (const sub of group.subCategories) {
//         console.log(` Subcategory: ${sub}`);

//         await clickMenMenuItem(page, sub);
//         const subProducts = await scrapeCategory(page);

//         for (const url of subProducts) {
//           const data = await scrapeProduct(browser, url);
//           if (!data?.productCode) continue;

//           const exists = await MyntraProduct.findOne({
//             productCode: data.productCode,
//           });

//           if (!exists) await MyntraProduct.create(data);
//         }

//         await page.goto(HOME_URL, { waitUntil: "domcontentloaded" });
//         await delay(4000);
//       }
//     }

//     console.log("\nSCRAPING COMPLETED SUCCESSFULLY");
//   } catch (err) {
//     console.error(err);
//   } finally {
//     await browser.close();
//   }
// };

// module.exports = scrapeAllData;



const puppeteer = require("puppeteer");
const scrapeCategory = require("./scrapeCategory");

const HOME_URL = "https://www.myntra.com/";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function openMenMenu(page) {
  const menSelector = 'a.desktop-main[data-group="men"]';
  await page.waitForSelector(menSelector, { timeout: 15000 });
  await page.hover(menSelector);
  await page.waitForSelector(
    '.desktop-categoryContainer[data-group="men"]',
    { timeout: 15000 }
  );
  await delay(1200);
}

// async function clickMenMenuItem(page, label) {
//   await openMenMenu(page);

//   const elementHandle = await page.evaluateHandle((text) => {
//     const links = Array.from(
//       document.querySelectorAll(
//         '.desktop-categoryContainer[data-group="men"] a'
//       )
//     );
//     return links.find((a) => a.innerText.trim() === text) || null;
//   }, label);

//   if (!elementHandle) {
//     throw new Error(`Menu item not found: ${label}`);
//   }

//   const box = await elementHandle.boundingBox();
//   if (!box) {
//     throw new Error(`Cannot get bounding box for: ${label}`);
//   }

//   await page.mouse.move(
//     box.x + box.width / 2,
//     box.y + box.height / 2,
//     { steps: 15 }
//   );

//   await delay(300);

//   await page.mouse.click(
//     box.x + box.width / 2,
//     box.y + box.height / 2
//   );

//   await page.waitForNavigation({
//     waitUntil: "domcontentloaded",
//     timeout: 60000,
//   });

//   await delay(3000);
// }

async function clickMenMenuItem(page, label) {
  await openMenMenu(page);

  // 1️⃣ Find index of the menu item by text (inside browser)
  const index = await page.evaluate((text) => {
    const links = Array.from(
      document.querySelectorAll(
        '.desktop-categoryContainer[data-group="men"] a'
      )
    );

    return links.findIndex(
      (a) => a.innerText.trim() === text
    );
  }, label);

  if (index === -1) {
    throw new Error(`Menu item not found: ${label}`);
  }

  // 2️⃣ Get ElementHandle safely using index
  const links = await page.$$(
    '.desktop-categoryContainer[data-group="men"] a'
  );

  const elementHandle = links[index];

  if (!elementHandle) {
    throw new Error(`ElementHandle missing for: ${label}`);
  }

  // 3️⃣ Real mouse movement (VISIBLE IN UI)
  const box = await elementHandle.boundingBox();
  if (!box) {
    throw new Error(`Cannot get bounding box for: ${label}`);
  }

  await page.mouse.move(
    box.x + box.width / 2,
    box.y + box.height / 2,
    { steps: 15 }
  );

  await delay(300);

  await page.mouse.click(
    box.x + box.width / 2,
    box.y + box.height / 2
  );

  // 4️⃣ Wait for navigation
  await page.waitForNavigation({
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await delay(3000);
}



async function getMenMenu(page) {
  return page.evaluate(() => {
    const container = document.querySelector(
      '.desktop-categoryContainer[data-group="men"]'
    );
    if (!container) return [];

    return Array.from(container.querySelectorAll(".desktop-navBlock"))
      .map((block) => {
        const parent = block.querySelector(".desktop-categoryName");
        if (!parent) return null;

        return {
          parentName: parent.innerText.trim(),
          subCategories: Array.from(
            block.querySelectorAll(".desktop-categoryLink")
          ).map((a) => a.innerText.trim()),
        };
      })
      .filter(Boolean);
  });
}

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
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122 Safari/537.36"
    );

    await page.goto(HOME_URL, { waitUntil: "domcontentloaded" });
    await delay(6000);

    await openMenMenu(page);
    const menuTree = await getMenMenu(page);

    for (const group of menuTree) {
      console.log(`\nPARENT CATEGORY: ${group.parentName}`);

   
      await clickMenMenuItem(page, group.parentName);
      await scrapeCategory(page, browser);

      await page.goto(HOME_URL, { waitUntil: "domcontentloaded" });
      await delay(4000);


      for (const sub of group.subCategories) {
        console.log(` Subcategory: ${sub}`);

        await clickMenMenuItem(page, sub);
        await scrapeCategory(page, browser);

        await page.goto(HOME_URL, { waitUntil: "domcontentloaded" });
        await delay(4000);
      }
    }

    console.log("\nALL CATEGORIES SCRAPED PAGE-WISE SUCCESSFULLY");
  } catch (err) {
    console.error("Scraping failed:", err);
  } finally {
    await browser.close();
  }
};

module.exports = scrapeAllData;
