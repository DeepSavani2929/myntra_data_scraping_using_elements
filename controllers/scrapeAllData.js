const puppeteer = require("puppeteer");
const scrapeCategory = require("./scrapeCategory");

const HOME_URL = "https://www.myntra.com/";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function openMenMenu(page) {
  const menSelector = 'a.desktop-main[data-group="men"]';
  await page.waitForSelector(menSelector, { timeout: 15000 });
  await page.hover(menSelector);
  await page.waitForSelector('.desktop-categoryContainer[data-group="men"]', {
    timeout: 15000,
  });
  await delay(1200);
}

async function clickMenMenuItem(page, label) {
  await openMenMenu(page);

  const index = await page.evaluate((text) => {
    const links = Array.from(
      document.querySelectorAll(
        '.desktop-categoryContainer[data-group="men"] a'
      )
    );

    return links.findIndex((a) => a.innerText.trim() === text);
  }, label);

  if (index === -1) {
    throw new Error(`Menu item not found: ${label}`);
  }

  const links = await page.$$('.desktop-categoryContainer[data-group="men"] a');

  const elementHandle = links[index];

  if (!elementHandle) {
    throw new Error(`ElementHandle missing for: ${label}`);
  }

  const box = await elementHandle.boundingBox();
  if (!box) {
    throw new Error(`Cannot get bounding box for: ${label}`);
  }

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 15,
  });

  await delay(300);

  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

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
        const parentName = parent?.innerText.trim();

        if (!parentName) return null;

        return {
          parentName,
          subCategories: Array.from(
            block.querySelectorAll(".desktop-categoryLink")
          )
            .map((a) => a.innerText.trim())
            .filter(Boolean),
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
