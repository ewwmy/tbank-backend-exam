const express = require('express');
const weatherController = require('./controllers/weather-controller');

const router = express.Router();

router.use('/weather', weatherController);

module.exports = router;
