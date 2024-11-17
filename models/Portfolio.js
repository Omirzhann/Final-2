const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true }, // Список ссылок на изображения
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
