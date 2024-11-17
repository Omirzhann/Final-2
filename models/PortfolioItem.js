const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  images: [String], // массив ссылок на изображения
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // ссылка на создателя
});

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);
