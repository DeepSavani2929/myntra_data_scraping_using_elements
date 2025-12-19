// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// const scrapeCategory = async (page, categoryUrl) => {
//   console.log("Opening Myntra category page...");

//   await page.goto(categoryUrl, {
//     waitUntil: "domcontentloaded",
//     timeout: 60000,
//   });

//   const blocked = await page.evaluate(
//     () =>
//       document.body.innerText.includes("Access Denied") ||
//       document.body.innerText.includes("Something went wrong")
//   );

//   if (blocked) {
//     throw new Error("Blocked by Myntra on category page");
//   }

//   let prevHeight = 0;

//   for (let i = 0; i < 12; i++) {
//     const height = await page.evaluate(() => document.body.scrollHeight);
//     if (height === prevHeight) break;

//     prevHeight = height;
//     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
//     await delay(2000);
//   }

//   const productLinks = await page.evaluate(() =>
//     Array.from(document.querySelectorAll("a[href*='/buy']"))
//       .map((a) => a.href)
//       .filter(Boolean)
//   );

//   console.log(`Found ${productLinks.length} product URLs`);
//   console.log([...new Set(productLinks)]);
//   return [...new Set(productLinks)];
// };

// module.exports = scrapeCategory;

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// const MAX_PAGES = 1;

// async function scrapeCategory(page, baseCategoryUrl) {
//   console.log("Opening paginated category...");

//   const allProductUrls = new Set();

//   for (let pageNo = 1; pageNo <= MAX_PAGES; pageNo++) {
//     const paginatedUrl =
//       pageNo === 1
//         ? baseCategoryUrl
//         : `${baseCategoryUrl}?p=${pageNo}`;

//     console.log(`Page ${pageNo}: ${paginatedUrl}`);

//     await page.goto(paginatedUrl, {
//       waitUntil: "domcontentloaded",
//       timeout: 60000,
//     });

//     await delay(2000);

//     const blocked = await page.evaluate(
//       () =>
//         document.body.innerText.includes("Access Denied") ||
//         document.body.innerText.includes("Something went wrong")
//     );

//     if (blocked) {
//       console.log(" Blocked on page", pageNo);
//       break;
//     }

//     const productLinks = await page.evaluate(() =>
//       Array.from(document.querySelectorAll("a[href*='/buy']"))
//         .map((a) => a.href)
//         .filter(Boolean)
//     );

//     if (productLinks.length === 0) {
//       console.log(" No products found, stopping pagination");
//       break;
//     }

//     productLinks.forEach((url) => allProductUrls.add(url));

//     console.log(` Products on page ${pageNo}: ${productLinks.length}`);

//     await delay(1500);

//      console.log(` TOTAL UNIQUE PRODUCTS: ${allProductUrls.size}`);
//      return [...allProductUrls];
//   }

// }

// module.exports = scrapeCategory;

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// const MAX_PAGES = 1;

// async function scrapeCategory(page) {
//   console.log("Scraping category from current PLP...");

//   const allProductUrls = new Set();

//   for (let pageNo = 1; pageNo <= MAX_PAGES; pageNo++) {
//     if (pageNo > 1) {
//       const nextPageUrl = `${page.url()}?p=${pageNo}`;
//       await page.goto(nextPageUrl, {
//         waitUntil: "domcontentloaded",
//         timeout: 60000,
//       });
//       await delay(2000);
//     }

//     const blocked = await page.evaluate(
//       () =>
//         document.body.innerText.includes("Access Denied") ||
//         document.body.innerText.includes("Something went wrong")
//     );

//     if (blocked) {
//       console.log("Blocked on page", pageNo);
//       break;
//     }

//     const productLinks = await page.evaluate(() =>
//       Array.from(document.querySelectorAll("a[href*='/buy']"))
//         .map((a) => a.href)
//         .filter(Boolean)
//     );

//     if (productLinks.length === 0) break;

//     productLinks.forEach((url) => allProductUrls.add(url));

//     console.log(`Products on page ${pageNo}: ${productLinks.length}`);
//     console.log(`TOTAL UNIQUE PRODUCTS: ${allProductUrls.size}`);

//     await delay(1500);
//   }

//   return [...allProductUrls];
// }

// module.exports = scrapeCategory;

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// async function scrapeCategory(page) {
//   console.log("Scraping category using pagination buttons...");

//   const allProductUrls = new Set();
//   let pageCount = 1;

//   while (true) {
//     console.log(` Scraping PLP page ${pageCount}`);

//     const blocked = await page.evaluate(() =>
//       document.body.innerText.includes("Access Denied") ||
//       document.body.innerText.includes("Something went wrong")
//     );

//     if (blocked) {
//       console.log(" Blocked detected, stopping pagination");
//       break;
//     }

//     const productLinks = await page.evaluate(() =>
//       Array.from(document.querySelectorAll("a[href*='/buy']"))
//         .map((a) => a.href)
//         .filter(Boolean)
//     );

//     if (productLinks.length === 0) {
//       console.log(" No products found on page");
//       break;
//     }

//     productLinks.forEach((url) => allProductUrls.add(url));

//     console.log(
//       ` Products on page ${pageCount}: ${productLinks.length} | Total: ${allProductUrls.size}`
//     );

//     const hasNext = await page.evaluate(() => {
//       const nextBtn = document.querySelector(
//         "li.pagination-next:not(.pagination-disabled) a"
//       );
//       if (!nextBtn) return false;
//       nextBtn.click();
//       return true;
//     });

//     if (!hasNext) {
//       console.log(" NEXT button disabled → End of pagination");
//       break;
//     }

//     await page.waitForNavigation({
//       waitUntil: "domcontentloaded",
//       timeout: 60000,
//     });

//     await delay(2000);
//     pageCount++;
//   }

//   return [...allProductUrls];
// }

// module.exports = scrapeCategory;

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));
// const scrapeProduct = require("./scrapeProduct");
// const MyntraProduct = require("../models/productSchema");

// async function scrapeCategory(page, browser) {
//   console.log("Scraping category page-wise (product details)...");

//   let pageCount = 1;

//   while (true) {
//     console.log(`\n--- PLP PAGE ${pageCount} ---`);

//     const blocked = await page.evaluate(
//       () =>
//         document.body.innerText.includes("Access Denied") ||
//         document.body.innerText.includes("Something went wrong")
//     );

//     if (blocked) {
//       console.log("Blocked detected → stop category");
//       return;
//     }

//     const productUrls = await page.evaluate(() =>
//       Array.from(document.querySelectorAll("a[href*='/buy']"))
//         .map((a) => a.href)
//         .filter(Boolean)
//     );

//     if (productUrls.length === 0) {
//       console.log("No products found → stop category");
//       return;
//     }

//     console.log(`Products on page ${pageCount}: ${productUrls.length}`);

//     for (const url of productUrls) {
//       try {
//         const productData = await scrapeProduct(browser, url);
//         if (!productData?.productCode) continue;

//         const productCode = String(productData.productCode).trim();
//         if (!productCode) continue;

//         const exists = await MyntraProduct.findOne({
//           productCode: productCode,
//         }).lean();

//         if (!exists) {
//           await MyntraProduct.create({
//             ...productData,
//             productCode,
//           });
//           console.log("Saved:", productData.productName, "|", productCode);
//         } else {
//           console.log(
//             "Already exists:",
//             productData.productName,
//             "|",
//             productCode
//           );
//         }
//       } catch (err) {
//         console.error("Product scrape failed:", err.message);
//       }
//     }

//     const nextBtnHandle = await page.evaluateHandle(() => {
//       const nextLi = document.querySelector("li.pagination-next");
//       if (!nextLi) return null;

//       if (nextLi.classList.contains("pagination-disabled")) {
//         return null;
//       }

//       return nextLi;
//     });

//     const nextBtn = nextBtnHandle.asElement();

//     if (!nextBtn) {
//       console.log("NEXT disabled → Category completed");
//       return;
//     }

//     const box = await nextBtn.boundingBox();
//     if (!box) {
//       console.log("NEXT not clickable → Category completed");
//       return;
//     }

//     console.log(` Clicking NEXT page (Page ${pageCount + 1})`);

//     await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
//       steps: 15,
//     });

//     await delay(300);

//     await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

//     await page.waitForFunction(
//       () => document.querySelectorAll("a[href*='/buy']").length > 0,
//       { timeout: 20000 }
//     );

//     const firstProductHref = productUrls[0];

//     await delay(2000);
//     pageCount++;
//   }
// }

// module.exports = scrapeCategory;



// const delay = (ms) => new Promise((res) => setTimeout(res, ms));
// const scrapeProduct = require("./scrapeProduct");
// const MyntraProduct = require("../models/productSchema");

// async function scrapeCategory(page, browser) {
//   console.log("Scraping category page-wise (product details)...");

//   let pageCount = 1;

//   while (true) {
//     console.log(`\n--- PLP PAGE ${pageCount} ---`);

//     /* =====================
//        BLOCK CHECK
//     ====================== */
//     const blocked = await page.evaluate(
//       () =>
//         document.body.innerText.includes("Access Denied") ||
//         document.body.innerText.includes("Something went wrong")
//     );

//     if (blocked) {
//       console.log("Blocked detected → stop category");
//       return;
//     }

//     /* =====================
//        GET PRODUCT URLS
//     ====================== */
//     const productUrls = await page.evaluate(() =>
//       Array.from(document.querySelectorAll("a[href*='/buy']"))
//         .map((a) => a.href)
//         .filter(Boolean)
//     );

//     if (productUrls.length === 0) {
//       console.log("No products found → stop category");
//       return;
//     }

//     console.log(`Products on page ${pageCount}: ${productUrls.length}`);

//     /* =====================
//        SCRAPE PRODUCT DETAILS
//     ====================== */
//     for (const url of productUrls) {
//       try {
//         const productData = await scrapeProduct(browser, url);
//         if (!productData?.productCode) continue;

//         const productCode = String(productData.productCode).trim();
//         if (!productCode) continue;

//         const exists = await MyntraProduct.findOne({
//           productCode,
//         }).lean();

//         if (!exists) {
//           await MyntraProduct.create({
//             ...productData,
//             productCode,
//           });
//           console.log("Saved:", productData.productName, "|", productCode);
//         } else {
//           console.log(
//             "Already exists:",
//             productData.productName,
//             "|",
//             productCode
//           );
//         }
//       } catch (err) {
//         console.error("Product scrape failed:", err.message);
//       }
//     }

//     const nextBtnHandle = await page.evaluateHandle(() => {
//       const nextLi = document.querySelector("li.pagination-next");
//       if (!nextLi) return null;
//       if (nextLi.classList.contains("pagination-disabled")) return null;
//       return nextLi;
//     });

//     const nextBtn = nextBtnHandle.asElement();
//     if (!nextBtn) {
//       console.log("NEXT disabled → Category completed");
//       return;
//     }

//     const box = await nextBtn.boundingBox();
//     if (!box) {
//       console.log("NEXT not clickable → Category completed");
//       return;
//     }


//     const firstProductHref = productUrls[0];

//     console.log(`👉 Clicking NEXT page (Page ${pageCount + 1})`);

//     await page.mouse.move(
//       box.x + box.width / 2,
//       box.y + box.height / 2,
//       { steps: 15 }
//     );
//     await delay(300);
//     await page.mouse.click(
//       box.x + box.width / 2,
//       box.y + box.height / 2
//     );

//     await page.waitForFunction(
//       (prevHref) => {
//         const firstLink = document.querySelector("a[href*='/buy']");
//         return firstLink && firstLink.href !== prevHref;
//       },
//       { timeout: 2000 },
//       firstProductHref
//     );

//     await delay(2000);
//     pageCount++;
//   }
// }

// module.exports = scrapeCategory;



// const delay = (ms) => new Promise((res) => setTimeout(res, ms));
// const scrapeProduct = require("./scrapeProduct");
// const MyntraProduct = require("../models/productSchema");

// async function scrapeCategory(page, browser) {
//   console.log("Scraping category page-wise (product details)...");

//   let pageCount = 1;

//   while (true) {
//     console.log(`\n--- PLP PAGE ${pageCount} ---`);


//     const blocked = await page.evaluate(
//       () =>
//         document.body.innerText.includes("Access Denied") ||
//         document.body.innerText.includes("Something went wrong")
//     );

//     if (blocked) {
//       console.log("Blocked detected → stop category");
//       return;
//     }

//     const productUrls = await page.evaluate(() =>
//       Array.from(document.querySelectorAll("a[href*='/buy']"))
//         .map((a) => a.href)
//         .filter(Boolean)
//     );

//     if (productUrls.length === 0) {
//       console.log("No products found → stop category");
//       return;
//     }

//     console.log(`Products on page ${pageCount}: ${productUrls.length}`);

//     for (const url of productUrls) {
//       try {
//         const productData = await scrapeProduct(browser, url);
//         if (!productData?.productCode) continue;

//         const productCode = String(productData.productCode).trim();
//         if (!productCode) continue;

//         const exists = await MyntraProduct.findOne({ productCode }).lean();

//         if (!exists) {
//           await MyntraProduct.create({ ...productData, productCode });
//           console.log("Saved:", productData.productName, "|", productCode);
//         } else {
//           console.log(
//             "Already exists:",
//             productData.productName,
//             "|",
//             productCode
//           );
//         }
//       } catch (err) {
//         console.error("Product scrape failed:", err.message);
//       }
//     }


//     const currentPageNo = await page.evaluate(() => {
//       const meta = document.querySelector(".pagination-paginationMeta");
//       if (!meta) return null;
//       const match = meta.innerText.match(/Page\s+(\d+)/i);
//       return match ? Number(match[1]) : null;
//     });

//     const nextBtnHandle = await page.evaluateHandle(() => {
//       const nextLi = document.querySelector("li.pagination-next");
//       if (!nextLi) return null;
//       if (nextLi.classList.contains("pagination-disabled")) return null;
//       return nextLi;
//     });

//     const nextBtn = nextBtnHandle.asElement();
//     if (!nextBtn) {
//       console.log("NEXT disabled → Category completed");
//       return;
//     }

//     const box = await nextBtn.boundingBox();
//     if (!box) {
//       console.log("NEXT not clickable → Category completed");
//       return;
//     }

//     console.log(`👉 Clicking NEXT page (Page ${pageCount + 1})`);

//     await page.mouse.move(
//       box.x + box.width / 2,
//       box.y + box.height / 2,
//       { steps: 15 }
//     );
//     await delay(300);
//     await page.mouse.click(
//       box.x + box.width / 2,
//       box.y + box.height / 2
//     );

//     await page.waitForFunction(
//       (prevPage) => {
//         const meta = document.querySelector(".pagination-paginationMeta");
//         if (!meta) return false;
//         const match = meta.innerText.match(/Page\s+(\d+)/i);
//         return match && Number(match[1]) > prevPage;
//       },
//       { timeout: 30000 },
//       currentPageNo
//     );

//     await delay(2000);
//     pageCount++;
//   }
// }

// module.exports = scrapeCategory;



const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const scrapeProduct = require("./scrapeProduct");
const MyntraProduct = require("../models/productSchema");

async function scrapeCategory(page, browser) {
  console.log("Scraping category page-wise (product details)...");

  const scrapedProductUrls = new Set();
  let pageCount = 1;

  while (true) {
    console.log(`\n--- PLP PAGE ${pageCount} ---`);


    const blocked = await page.evaluate(
      () =>
        document.body.innerText.includes("Access Denied") ||
        document.body.innerText.includes("Something went wrong")
    );

    if (blocked) {
      console.log("Blocked detected → stop category");
      return;
    }


    const allVisibleProductUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href*='/buy']"))
        .map((a) => a.href)
        .filter(Boolean)
    );

    if (allVisibleProductUrls.length === 0) {
      console.log("No products found → stop category");
      return;
    }

 
    const newProductUrls = allVisibleProductUrls.filter(
      (url) => !scrapedProductUrls.has(url)
    );

    if (newProductUrls.length === 0) {
      console.log("No new products → category completed");
      return;
    }

    console.log(
      `Visible: ${allVisibleProductUrls.length} | New: ${newProductUrls.length}`
    );

    for (const url of newProductUrls) {
      try {
        const productData = await scrapeProduct(browser, url);
        if (!productData?.productCode) continue;

        const productCode = String(productData.productCode).trim();
        if (!productCode) continue;

        scrapedProductUrls.add(url);

        const exists = await MyntraProduct.findOne({ productCode }).lean();

        if (!exists) {
          await MyntraProduct.create({ ...productData, productCode });
          console.log("Saved:", productData.productName, "|", productCode);
        } else {
          console.log(
            "Already exists:",
            productData.productName,
            "|",
            productCode
          );
        }
      } catch (err) {
        console.error("Product scrape failed:", err.message);
      }
    }

    const nextBtnHandle = await page.evaluateHandle(() => {
      const nextLi = document.querySelector("li.pagination-next");
      if (!nextLi) return null;
      if (nextLi.classList.contains("pagination-disabled")) return null;
      return nextLi;
    });

    const nextBtn = nextBtnHandle.asElement();
    if (!nextBtn) {
      console.log("NEXT disabled → Category completed");
      return;
    }

    const box = await nextBtn.boundingBox();
    if (!box) {
      console.log("NEXT not clickable → Category completed");
      return;
    }

    console.log(` Clicking NEXT (Page ${pageCount + 1})`);

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


    await delay(3000);
    pageCount++;
  }
}

module.exports = scrapeCategory;
