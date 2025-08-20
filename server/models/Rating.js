// models/Rating.js
const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1, 
    max: 5, 
    required: [true, 'Please add a rating between 1 and 5'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


RatingSchema.index({ store: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);