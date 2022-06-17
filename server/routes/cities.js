/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const cities = require('../data/cities.json');

const router = express.Router();

router.get('/', (req, res) => {
    res.send(cities);
})

module.exports = router;