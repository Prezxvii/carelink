const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    url: { type: String, default: '' },
    type: { type: String, enum: ['nyc', 'user'], default: 'nyc' },
    user: { type: String, default: 'CareLink' },
    isExpert: { type: Boolean, default: false },
    time: { type: String, default: 'Verified' },
    likes: { type: Number, default: 0 },
    comments: { type: Array, default: [] }, // you can formalize later
    tags: { type: [String], default: [] },  // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', ResourceSchema);
