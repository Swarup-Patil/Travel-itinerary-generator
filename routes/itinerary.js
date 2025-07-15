const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../controllers/itinerary');
const {itineraryLimiter} = require('../helpers/ratelimit')

router.post('/', itineraryLimiter, generateItinerary);

module.exports = router;
