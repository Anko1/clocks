const router = require('express').Router();
const clocks = require('./clock.js');

router
    .use('/clocks', clocks);

module.exports = router;