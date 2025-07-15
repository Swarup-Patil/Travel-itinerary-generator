import express from 'express';
import { generateItinerary } from '../controllers/itinerary.js';
import { itineraryLimiter } from '../helpers/ratelimit.js';

const router = express.Router();

router.post('/', itineraryLimiter, generateItinerary);

export default router;
