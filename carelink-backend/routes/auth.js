const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- MIDDLEWARE: PROTECT ROUTES ---
const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// --- REGISTER ---
// Endpoint: POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, location, interests } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password, location, interests });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        location, 
        interests, 
        savedItems: [] 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// --- LOGIN ---
// Endpoint: POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        location: user.location, 
        interests: user.interests, 
        savedItems: user.savedItems 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// --- TOGGLE FAVORITE ---
// Endpoint: POST /api/auth/toggle-favorite
router.post('/toggle-favorite', auth, async (req, res) => {
  const { resourceId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const isSaved = user.savedItems.includes(resourceId);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      isSaved ? { $pull: { savedItems: resourceId } } : { $addToSet: { savedItems: resourceId } },
      { new: true }
    );

    res.json({ success: true, savedItems: updatedUser.savedItems });
  } catch (err) {
    res.status(500).json({ message: "Error updating favorites" });
  }
});

// --- UPDATE PROFILE ---
// Endpoint: PUT /api/auth/update-profile
router.put('/update-profile', auth, async (req, res) => {
  const { name, location, interests } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, location, interests } },
      { new: true }
    ).select('-password');

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// --- GET CURRENT USER ---
// Endpoint: GET /api/auth/user
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// --- DELETE ACCOUNT ---
// Endpoint: DELETE /api/auth/delete-account
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during account deletion" });
  }
});

module.exports = router;