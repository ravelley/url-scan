const express = require('express');
const jsend = require('jsend');
const scanService = require('../service/scan');

const router = express.Router();

router.post('/', (req, res, next) => {
  scanService.getUrlDetails(req.body.url)
    .then(() => res.status(200).json(jsend.success()))
    .catch((err) => next(err));
});

module.exports = router;
