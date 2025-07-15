const express = require('express');
const itineraryRoutes = require('./routes/itinerary');
const PORT = process.env.PORT || 8000;
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/',(req,res) => {
  res.send("Lets Generate Itinerary!")
})

app.use('/api/itinerary', itineraryRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;
