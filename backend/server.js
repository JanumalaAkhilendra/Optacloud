const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

// Middleware for CORS with localhost configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from localhost:3000
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

// Connect to MongoDB
const DB = process.env.DB_CONNECTION_STRING.replace(
  "<password>",
  process.env.DB_PASSWORD
);
async function connectDB() {
  try {
    await mongoose.connect(DB);
    console.log("Successfully connected to db");
  } catch (err) {
    console.error("Error connecting to DB", err);
  }
}
connectDB();

// Address Routes
const addressRoutes = require(__dirname + "/routes/addressRoutes.js");
app.use("/addresses", addressRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
