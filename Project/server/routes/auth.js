const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/User");

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ fullname, username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user: { email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
