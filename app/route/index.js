const app = require('express')();
const jsend = require('jsend');

const swagger = require('swagger-ui-express');
const swaggerConfig = require('./swagger.json');

app.use('/doc', swagger.serve, swagger.setup(swaggerConfig));
app.use('/scan', require('./scan'));

app.all('*', (req, res) => res.status(404).json(jsend.fail('URL not found.')));

module.exports = app;
