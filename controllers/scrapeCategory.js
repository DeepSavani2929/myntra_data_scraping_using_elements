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


const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const MAX_PAGES = 20; 

async function scrapeCategory(page, baseCategoryUrl) {
  console.log("Opening paginated category...");

  const allProductUrls = new Set();

  for (let pageNo = 1; pageNo <= MAX_PAGES; pageNo++) {
    const paginatedUrl =
      pageNo === 1
        ? baseCategoryUrl
        : `${baseCategoryUrl}?p=${pageNo}`;

    console.log(`Page ${pageNo}: ${paginatedUrl}`);

    await page.goto(paginatedUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await delay(2000);

    const blocked = await page.evaluate(
      () =>
        document.body.innerText.includes("Access Denied") ||
        document.body.innerText.includes("Something went wrong")
    );

    if (blocked) {
      console.log(" Blocked on page", pageNo);
      break;
    }

    const productLinks = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href*='/buy']"))
        .map((a) => a.href)
        .filter(Boolean)
    );

    if (productLinks.length === 0) {
      console.log(" No products found, stopping pagination");
      break;
    }

    productLinks.forEach((url) => allProductUrls.add(url));

    console.log(` Products on page ${pageNo}: ${productLinks.length}`);

    await delay(1500);
  }

  console.log(` TOTAL UNIQUE PRODUCTS: ${allProductUrls.size}`);
  return [...allProductUrls];
}

module.exports = scrapeCategory;
