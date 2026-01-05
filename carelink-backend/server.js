const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Security & Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); // MUST be above the routes

// 3. Mount Modular Routes
// Tells Express to use your auth routes
app.use('/api/auth', require('./routes/auth'));

// --- ADDED: Mount the Content Route ---
// This enables the News and YouTube Proxy routes
app.use('/api/content', require('./routes/content'));

/**
 * GET /api/resources
 * Fetches data from NYC Open Data API
 */
app.get('/api/resources', async (req, res) => {
  try {
    const APP_TOKEN = process.env.NYC_APP_TOKEN || 's3uth6GGknsBpPg4cWEJTxnt8';

    const response = await axios.get('https://data.cityofnewyork.us/resource/yjpx-srhp.json', {
      params: { 
        '$limit': 500,                      
        '$where': "language = 'English'",   
        '$order': 'program_name ASC'        
      },
      headers: { 
        'X-App-Token': APP_TOKEN 
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("NYC API Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch NYC Data" });
  }
});

// Health Check
app.get('/health', (req, res) => res.send('CareLink Server is Online'));

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 Server:  http://localhost:${PORT}`);
  console.log(`🔑 Auth:    http://localhost:${PORT}/api/auth`);
  console.log(`📰 Content: http://localhost:${PORT}/api/content`);
  console.log(`-----------------------------------------`);
});