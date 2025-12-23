const scrapeProduct = async (browser, url) => {
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  await page.waitForSelector(".pdp-details", { timeout: 15000 });

  const data = await page.evaluate(() => {
    const brandName = document.querySelector(".pdp-title")?.innerText.trim();
    const productName = document.querySelector(".pdp-name")?.innerText.trim();

    const price =
      Number(
        document
          .querySelector(".pdp-price strong")
          ?.innerText.replace(/[^\d]/g, "")
      ) || null;

    const mrp =
      Number(
        document.querySelector(".pdp-mrp s")?.innerText.replace(/[^\d]/g, "")
      ) || null;

    const discount =
      document.querySelector(".pdp-discount")?.innerText.trim() || null;

    const rating =
      Number(
        document.querySelector(".index-overallRating > div")?.innerText.trim()
      ) || null;

    const images = Array.from(document.querySelectorAll(".image-grid-image"))
      .map((div) =>
        div.style.backgroundImage.replace('url("', "").replace('")', "")
      )
      .filter(Boolean);

    const sizes = Array.from(
      document.querySelectorAll(".size-buttons-size-button")
    )
      .map((btn) => {
        const sizeEl = btn.querySelector(".size-buttons-unified-size");
        if (!sizeEl) return null;

        const sizeText = Array.from(sizeEl.childNodes)
          .filter(
            (node) =>
              node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
          )
          .map((node) => node.textContent.trim())
          .join(" ");

        const priceEl = sizeEl.querySelector(".size-buttons-sku-price");
        const sizePrice = priceEl
          ? Number(priceEl.innerText.replace(/[^\d]/g, ""))
          : null;

        if (!sizeText) return null;

        return sizePrice
          ? { size: sizeText, price: sizePrice }
          : { size: sizeText };
      })
      .filter(Boolean);

    const colors = Array.from(
      document.querySelectorAll(".colors-container a")
    ).map((a) => {
      const img = a.querySelector("img");
      return {
        color: a.getAttribute("title"),
        url: new URL(a.getAttribute("href"), location.origin).href,
        image: img?.getAttribute("src") || null,
      };
    });

    const description = Array.from(
      document.querySelectorAll(".pdp-product-description-content ul li")
    ).map((li) => li.innerText.trim());

    const sizeFit = document
      .querySelector(".pdp-sizeFitDescContent")
      ?.innerText.trim();

    const specifications = {};
    document.querySelectorAll(".index-row").forEach((row) => {
      const key = row.querySelector(".index-rowKey")?.innerText.trim();
      const value = row.querySelector(".index-rowValue")?.innerText.trim();
      if (key && value) specifications[key] = value;
    });

    const productCode = document
      .querySelector(".supplier-styleId")
      ?.innerText.trim();

    const offers = Array.from(
      document.querySelectorAll(".pdp-offers-offer")
    ).map((o) => o.innerText.trim());

    if (!productCode) return null;

    return {
      brandName,
      productName,
      price,
      mrp,
      discount,
      rating,
      images,
      sizes,
      colors,
      description,
      sizeFit,
      specifications,
      productCode,
      offers,
      url: window.location.href,
    };
  });

  await page.close();
  return data;
};

module.exports = scrapeProduct;
