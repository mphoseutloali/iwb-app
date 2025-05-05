// functions/index.js
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { connectToDatabase, productOperations } = require("./mongoService");

const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// Connect to MongoDB
connectToDatabase();

// API Routes
app.get("/products", async (req, res) => {
  try {
    const products = await productOperations.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Export as Firebase Function
exports.api = functions.https.onRequest(app);