require('dotenv').config();
const mongoose = require('mongoose');

const Resource = require('../models/Resource');
const Video = require('../models/Video');

const mockLiveFeed = require('./mockLiveFeed');
const mockVideos = require('./mockVideos');


function normalizeVideos(list = []) {
  return list
    .map((v) => {
      // Already-normalized shape
      if (v.videoId && v.title && v.thumbnail && v.url) {
        return {
          videoId: v.videoId,
          title: v.title,
          channelTitle: v.channelTitle || '',
          thumbnail: v.thumbnail,
          url: v.url,
          publishedAt: v.publishedAt ? new Date(v.publishedAt) : null,
          tags: Array.isArray(v.tags) ? v.tags : []
        };
      }

      // YouTube API-like shape
      const videoId = v?.id?.videoId;
      const title = v?.snippet?.title;
      const thumbnail =
        v?.snippet?.thumbnails?.medium?.url ||
        v?.snippet?.thumbnails?.high?.url ||
        v?.snippet?.thumbnails?.default?.url;

      if (!videoId || !title || !thumbnail) return null;

      return {
        videoId,
        title,
        channelTitle: v?.snippet?.channelTitle || '',
        thumbnail,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        publishedAt: v?.snippet?.publishedAt ? new Date(v.snippet.publishedAt) : null,
        tags: ['carelink', 'nyc', 'resources']
      };
    })
    .filter(Boolean);
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Mongo connected');

    //  Normalize videos before insert
    const normalizedVideos = normalizeVideos(mockVideos);

    // Wipe + reinsert (best for dev)
    await Resource.deleteMany({});
    await Video.deleteMany({});

    await Resource.insertMany(mockLiveFeed);
    await Video.insertMany(normalizedVideos);

    console.log(` Seeded Resources: ${mockLiveFeed.length}`);
    console.log(` Seeded Videos (normalized): ${normalizedVideos.length}`);

    process.exit(0);
  } catch (err) {
    console.error(' Seed failed:', err);
    process.exit(1);
  }
}

run();
