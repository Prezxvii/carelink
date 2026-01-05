const express = require('express');
const router = express.Router();
const axios = require('axios');

// YouTube quota circuit breaker
let YT_QUOTA_BLOCKED_UNTIL = 0;

function isQuotaExceededError(err) {
  const code = err?.response?.status;
  const reason = err?.response?.data?.error?.errors?.[0]?.reason || err?.response?.data?.error?.status;
  return code === 403 && String(reason).toLowerCase().includes('quota');
}

// NEWS API - Strictly NYC & English
router.get('/news', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    // Improved Query: Less strict, broader English terms for NYC assistance
    // Note: We remove encodeURIComponent here because axios handles it automatically in 'params'
    const query = 'New York City AND (assistance OR "social services" OR community)';
    
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '6', 10), 1), 20);

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        sortBy: 'relevancy', // 'relevancy' often returns better English results than 'publishedAt'
        language: 'en',
        page: page,
        pageSize: limit,
        apiKey: apiKey
      },
      headers: {
        'User-Agent': 'CareLinkApp/1.0' // Some APIs block requests without a User-Agent
      }
    });

    console.log(`NewsAPI successful: Found ${response.data?.totalResults || 0} articles`);

    res.json({
      articles: response.data?.articles || [],
      totalResults: response.data?.totalResults || 0
    });
  } catch (err) {
    // Detailed logging to help you see the EXACT error in your terminal
    console.error('--- NEWS API ERROR ---');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Message:', err.response.data.message);
    } else {
      console.error('Error:', err.message);
    }
    
    res.status(500).json({ articles: [], totalResults: 0, error: err.message });
  }
});

// YOUTUBE API - Strictly NYC & English
router.get('/videos', async (req, res) => {
  try {
    const now = Date.now();
    if (now < YT_QUOTA_BLOCKED_UNTIL) {
      return res.status(403).json({ 
        reason: 'quota_exceeded', 
        message: 'YouTube quota cooling down', 
        items: [] 
      });
    }

    const query = 'NYC HRA benefits guide English';
    const limit = Math.min(parseInt(req.query.limit || '6', 10), 12);
    const pageToken = req.query.pageToken || undefined;

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: limit,
        q: query,
        relevanceLanguage: 'en',
        type: 'video',
        key: process.env.YOUTUBE_API_KEY,
        ...(pageToken ? { pageToken } : {})
      }
    });

    res.json({
      items: response.data?.items || [],
      nextPageToken: response.data?.nextPageToken || null
    });
  } catch (err) {
    if (isQuotaExceededError(err)) {
      console.warn('YouTube Quota Exceeded. Starting 30-minute cooldown.');
      YT_QUOTA_BLOCKED_UNTIL = Date.now() + 30 * 60 * 1000;
      return res.status(403).json({ reason: 'quota_exceeded', items: [] });
    }
    console.error('YouTube Error:', err.message);
    res.status(500).json({ items: [] });
  }
});

module.exports = router;



