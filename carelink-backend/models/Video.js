const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    channelTitle: { type: String, default: '' },
    thumbnail: { type: String, required: true },
    url: { type: String, required: true },
    publishedAt: { type: Date, default: null },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', VideoSchema);
