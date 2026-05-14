const express = require("express");
const router = express.Router();
const User = require("../models/User");
// Import your bcrypt/jwt logic here if you have it

// --- EXISTING LOGIN/REGISTER ROUTES HERE ---

// ADDED: GET ALL USERS (Fixes the Dashboard 404)
router.get("/users", async (req, res) => {
  try {
    // Return names and emails for the team member selection
    const users = await User.find().select("name email role");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

module.exports = router;