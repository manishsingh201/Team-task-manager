const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. REGISTER ROUTE
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || "Member" 
    });

    await user.save();
    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Registration Error" });
  }
});

// 2. LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // Token generate
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || "secret_key", 
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login Server Error" });
  }
});

// 3. TEAM VIEW ROUTE
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;