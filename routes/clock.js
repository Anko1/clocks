const router = require('express').Router();
const {
    getAll,
    getById,
    putClock
} = require('../controllers/clock.js');

router
    .get('/all', getAll)
    .get('/test', putClock)
    .get('/id', getById);

module.exports = router;