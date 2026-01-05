// backend/controllers/contentController.js (or similar)
const axios = require('axios');

exports.getNYCNews = async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    // We target NYC and social service keywords to ensure accuracy
    const query = encodeURIComponent('NYC AND ("social services" OR "community resources" OR "housing help")');
    
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`
    );

    res.json({ articles: response.data.articles });
  } catch (error) {
    console.error("News API Error:", error.message);
    res.status(500).json({ message: "Failed to fetch news" });
  }
};

exports.getNYCVideos = async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const pageToken = req.query.pageToken || '';
    
    // Searching for specific NYC benefit channels and topics
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=NYC+HRA+benefits+guide&type=video&key=${apiKey}&pageToken=${pageToken}`
    );

    res.json({
      items: response.data.items,
      nextPageToken: response.data.nextPageToken
    });
  } catch (error) {
    console.error("YouTube API Error:", error.message);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};