const createError = require('http-errors');
const db = require('../util/database');
const logger = require('../util/logger');

const getMetadata = async (url) => {
  try {
    const sql = 'select metadata from url_metadata where url = ?';
    const params = [url];
    const rows = await db.call(sql, params);
    const result = rows[0];
    result.metadata = JSON.parse(result.metadata);
    return result;
  } catch (err) {
    logger.error(err.message);
    throw new createError.InternalServerError(err.message);
  }
};

module.exports = { getMetadata };
