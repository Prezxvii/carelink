const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to get resources (Food, Housing, etc.)
router.get('/', async (req, res) => {
  try {
    // You can replace this with a call to NYC Open Data Socrata API
    // const response = await axios.get('https://data.cityofnewyork.us/resource/xxxx-xxxx.json');
    // res.json(response.data);
    
    res.json({ message: "Resource data endpoint connected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;