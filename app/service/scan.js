const createError = require('http-errors');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const sslCertificate = require('get-ssl-certificate');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const db = require('../util/database');
const logger = require('../util/logger');
const metadataService = require('./metadata');
const UrlMetaData = require('../model/url-metadata');

puppeteer.use(StealthPlugin());

const scanUrl = async (url, rescan) => {
  const { href, hostname, protocol } = new URL(url);

  if (!rescan) {
    const metadata = await metadataService.getMetadata(href);
    if (metadata) return metadata;
  } else {
    // TODO: remove old screenshot
    const sql = 'delete from url_metadata where url = ?';
    const params = [href];
    await db.call(sql, params);
  }

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const metadata = new UrlMetaData(href);

    page.on('response', async (response) => {
      metadata.ipAddr = response.remoteAddress().ip;
    });

    await page.setViewport({ width: 800, height: 600 });
    await page.goto(href);
    // TODO: figure out better way to determine page load
    await page.waitFor(3000);

    metadata.destinationUrl = await page.target().url();

    const fileName = `${Date.now()}.png`;
    metadata.screenshot = `image/${Date.now()}.png`;
    await page.screenshot({ path: `${path.resolve(__dirname)}/../../data/image/${fileName}`, fullPage: true });

    if (protocol === 'https:') metadata.sslCertificate = await sslCertificate.get(hostname);

    metadata.timestamp = Date.now();

    const sql = 'insert into url_metadata (url, metadata) values (?, ?)';
    const params = [href, JSON.stringify(metadata)];
    await db.call(sql, params);

    return metadata;
  } catch (err) {
    logger.error(err.message);
    throw new createError.InternalServerError(err.message);
  } finally {
    await browser.close();
  }
};

module.exports = { scanUrl };
