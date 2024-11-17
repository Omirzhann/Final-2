const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

// Маршруты для портфолио
router.post('/add', authMiddleware, portfolioController.addPortfolio);
router.get('/', authMiddleware, portfolioController.getAllPortfolios);
router.put('/update/:id', authMiddleware, portfolioController.updatePortfolio);
router.delete('/delete/:id', authMiddleware, portfolioController.deletePortfolio);

module.exports = router;
