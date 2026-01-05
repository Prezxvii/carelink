const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Path to your Mongoose User model
const authMiddleware = require('../middleware/auth'); // Your JWT auth middleware

// POST /api/user/toggle-favorite
router.post('/toggle-favorite', authMiddleware, async (req, res) => {
  try {
    const { resourceId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if item is already saved
    const isSaved = user.savedItems.includes(resourceId);

    if (isSaved) {
      // Remove it (Unfavorite)
      user.savedItems = user.savedItems.filter(id => id !== resourceId);
    } else {
      // Add it (Favorite)
      user.savedItems.push(resourceId);
    }

    await user.save();
    res.json({ savedItems: user.savedItems });
  } catch (err) {
    res.status(500).json({ message: "Server error updating favorites" });
  }
});

module.exports = router;