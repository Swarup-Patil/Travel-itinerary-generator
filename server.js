import express from 'express';
import dotenv from 'dotenv';
import itineraryRoutes from './routes/itinerary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.set('trust proxy', 1);

// Routes
app.get('/', (req, res) => {
  res.send("Let's Generate Itinerary!");
});

app.use('/api/itinerary', itineraryRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
