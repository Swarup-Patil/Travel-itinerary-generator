import rateLimit from 'express-rate-limit';

export const itineraryLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 3, 
  message: {
    status: 429,
    error: "You've reached the maximum of 5 itineraries per day. Please try again tomorrow.",
  },
});