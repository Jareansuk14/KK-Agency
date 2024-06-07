const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

// Import routes
const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const listingsellRoutes = require("./routes/listingSell.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/propertiesforsell", listingsellRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!", error: err.message });
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 10000;
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "KK_Agency",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
