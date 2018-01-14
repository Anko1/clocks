const router = require('express').Router();
const {
    getAll,
    getById,
    putClock,
    topClocks,
    man,
    wom
} = require('../controllers/clock.js');

router
    .get('/all', getAll)
    .get('/test', putClock)
    .get('/id', getById)
    .get('/top', topClocks)
    .get('/man', man)
    .get('/wom', wom);

module.exports = router;