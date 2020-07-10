const createError = require('http-errors');
const scan = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

scan.use(StealthPlugin());

const getUrlDetails = async (url) => {
  const browser = await scan.launch({ headless: true });
  const page = await browser.newPage();
  console.log(url);

  page.on('response', async (response) => {
    console.log(response.remoteAddress().ip);
  });

  try {
    await page.setViewport({ width: 800, height: 600 });
    await page.goto(url);
    await page.waitFor(5000);
    const b64string = await page.screenshot({ encoding: 'base64', fullPage: true });
    console.log(b64string);
  } catch (err) {
    console.error(err.message);
    throw new createError.InternalServerError(err.message);
  } finally {
    await browser.close();
  }
};

module.exports = { getUrlDetails };
