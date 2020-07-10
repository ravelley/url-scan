const bodyParser = require('body-parser');
const express = require('express');
const jsend = require('jsend');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1', require('./app/route'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const response = statusCode >= 500 ? jsend.error(err.message) : jsend.fail(err.message);
  res.status(statusCode).json(response);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

module.exports = app;
