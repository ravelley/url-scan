const express = require('express');
const jsend = require('jsend');
const metadataService = require('../service/metadata');

const router = express.Router();

router.post('/', (req, res, next) => {
  metadataService.getMetadata(req.body.url)
    .then((result) => res.json(jsend.success(result)))
    .catch((err) => next(err));
});

module.exports = router;
