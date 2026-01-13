const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to get resources (Food, Housing, etc.)
router.get('/', async (req, res) => {
  try {
  
    
    res.json({ message: "Resource data endpoint connected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
