const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listing');
const listingsellRoutes = require('./routes/listingSell');
const bookingRoutes = require('./routes/booking');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/auth', authRoutes);
app.use('/properties', listingRoutes);
app.use('/propertiesforsell', listingsellRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: 'KK_Agency',
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(10000, () => {
      console.log('Server running on port 10000');
    });
  })
  .catch((err) => console.error(`MongoDB connection error: ${err}`));

// Error handling for the server
app.on('error', (err) => {
  console.error(`Server error: ${err}`);
});
