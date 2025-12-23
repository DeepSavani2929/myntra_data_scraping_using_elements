const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const scrapeProduct = require("./scrapeProduct");
const MyntraProduct = require("../models/productSchema");

async function scrapeCategory(page, browser) {
  console.log("Scraping category page-wise (product details)...");

  let pageCount = 1;

  while (true) {
    console.log(`\n--- PLP PAGE ${pageCount} ---`);

    const blocked = await page.evaluate(
      () =>
        document.body.innerText.includes("Access Denied") ||
        document.body.innerText.includes("Something went wrong")
    );

    if (blocked) {
      console.log(" Block detected → stop category");
      return;
    }

    const productUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href*='/buy']"))
        .map((a) => a.href)
        .filter(Boolean)
    );

    if (productUrls.length === 0) {
      console.log("No products found → stop category");
      return;
    }

    console.log(`🛍 Products on page ${pageCount}: ${productUrls.length}`);

    for (const url of productUrls) {
      try {
        const productData = await scrapeProduct(browser, url);
        if (!productData?.productCode) continue;

        const productCode = String(productData.productCode).trim();
        if (!productCode) continue;

        const exists = await MyntraProduct.findOne({ productCode }).lean();

        if (!exists) {
          await MyntraProduct.create({ ...productData, productCode });
          console.log(" Saved:", productData.productName, "|", productCode);
        } else {
          console.log(
            "⏭ Already exists:",
            productData.productName,
            "|",
            productCode
          );
        }
      } catch (err) {
        console.error(" Product scrape failed:", err.message);
      }
    }

    const hasNext = await page.$(
      "li.pagination-next:not(.pagination-disabled)"
    );

    if (!hasNext) {
      console.log(" NEXT disabled → Category completed");
      return;
    }

    console.log(` Clicking NEXT (Page ${pageCount + 1})`);

    await page.evaluate(() => {
      document
        .querySelector("li.pagination-next")
        .scrollIntoView({ behavior: "smooth", block: "center" });
    });

    await delay(800);

    const firstProductBefore = await page.evaluate(
      () => document.querySelector("a[href*='/buy']")?.href
    );

    await Promise.all([
      page.click("li.pagination-next"),
      page.waitForFunction(
        (prev) => {
          const firstNow = document.querySelector("a[href*='/buy']")?.href;
          return firstNow && firstNow !== prev;
        },
        { timeout: 60000 },
        firstProductBefore
      ),
    ]);

    console.log(" Next page loaded");

    pageCount++;
  }
}

module.exports = scrapeCategory;
