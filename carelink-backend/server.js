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
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS with detailed logging
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log('\n=== INCOMING REQUEST ===');
  console.log(`🕒 Time: ${new Date().toISOString()}`);
  console.log(`📍 Method: ${req.method}`);
  console.log(`🔗 URL: ${req.url}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin header'}`);
  console.log(`📦 Content-Type: ${req.headers['content-type'] || 'Not set'}`);
  console.log(`🔑 Auth Token: ${req.headers['x-auth-token'] ? 'Present' : 'Not present'}`);
  console.log(`📋 Body:`, req.body);
  console.log('========================\n');
  next();
});

app.use(express.json()); // MUST be above the routes

// Log after JSON parsing
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('✅ Parsed JSON Body:', req.body);
  }
  next();
});

// 3. Mount Modular Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));

/**
 * GET /api/resources
 * Fetches data from NYC Open Data API
 */
app.get('/api/resources', async (req, res) => {
  try {
    console.log('📊 Fetching NYC resources...');
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
    console.log(`✅ NYC API returned ${response.data.length} resources`);
    res.json(response.data);
  } catch (error) {
    console.error("❌ NYC API Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch NYC Data" });
  }
});

// Health Check
app.get('/health', (req, res) => {
  console.log('💚 Health check requested');
  res.send('CareLink Server is Online');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n❌ ERROR CAUGHT:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 Server:  http://localhost:${PORT}`);
  console.log(`🔑 Auth:    http://localhost:${PORT}/api/auth`);
  console.log(`📰 Content: http://localhost:${PORT}/api/content`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ MISSING'}`);
  console.log(`📊 MongoDB: ${process.env.MONGO_URI ? '✅ Configured' : '❌ MISSING'}`);
  console.log(`-----------------------------------------`);
});