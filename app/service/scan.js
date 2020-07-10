const createError = require('http-errors');
const scan = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const logger = require('../util/logger');

scan.use(StealthPlugin());

const getUrlDetails = async (url) => {
  const browser = await scan.launch({ headless: true });
  const page = await browser.newPage();
  logger.debug(url);

  page.on('response', async (response) => {
    logger.debug(response.remoteAddress().ip);
  });

  try {
    await page.setViewport({ width: 800, height: 600 });
    await page.goto(url);
    await page.waitFor(5000);
    const b64string = await page.screenshot({ encoding: 'base64', fullPage: true });
    logger.debug(b64string);
  } catch (err) {
    logger.debug(err.message);
    throw new createError.InternalServerError(err.message);
  } finally {
    await browser.close();
  }
};

module.exports = { getUrlDetails };
