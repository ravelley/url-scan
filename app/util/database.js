const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('./logger');

const DBSOURCE = process.env.DBSOURCE || path.resolve(__dirname, '../../data/db.sqlite');
const db = new sqlite3.Database(DBSOURCE, (connectError) => {
  if (connectError) {
    logger.error(connectError.message);
    throw connectError;
  } else {
    db.run(`create table url_metadata (
        url TEXT PRIMARY KEY,
        metadata BLOB
    )`, () => {
      // table already exists
    });
  }
});

const call = (sql, params) => new Promise((resolve, reject) => {
  db.all(sql, params, (error, rows) => {
    if (error) reject(error);
    resolve(rows);
  });
});

module.exports = { call, db };
