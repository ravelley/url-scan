const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = process.env.DBSOURCE || '../../data/db.sqlite';
const db = new sqlite3.Database(DBSOURCE, (connectError) => {
  if (connectError) {
    console.error(connectError.message);
    throw connectError;
  } else {
    db.run(`create table url (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        screenshot BLOB
    )`, () => {
      // table already exists
    });
  }
});

const call = (sql, params) => {
  try {
    db.all(sql, params, (err, rows) => {
      if (err) {
        throw err;
      } else {
        return rows;
      }
    });
  } finally {
    db.close();
  }
};

module.exports = { call, db };
