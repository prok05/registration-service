/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const auto = require('../data/auto.json');

const router = express.Router();

router.get('/', (req, res) => {
    res.send(auto);
})

module.exports = router;