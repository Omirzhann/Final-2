const Portfolio = require('../models/Portfolio');

// Добавление нового проекта
exports.addPortfolio = async (req, res) => {
  try {
    const { title, description, images } = req.body;

    if (!title || !description || !images || images.length === 0) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения.' });
    }

    const userId = req.user.userId; // Получаем userId из токена
    const newPortfolio = await Portfolio.create({ userId, title, description, images });

    res.status(201).json({ message: 'Проект успешно добавлен.', portfolio: newPortfolio });
  } catch (error) {
    console.error('Ошибка при добавлении проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

// Получение всех проектов пользователя
exports.getAllPortfolios = async (req, res) => {
  try {
    const userId = req.user.userId;

    const portfolios = await Portfolio.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ portfolios });
  } catch (error) {
    console.error('Ошибка при получении портфолио:', error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

// Обновление проекта
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, images } = req.body;
    const { userId, role } = req.user;

    // Проверка роли
    if (role !== 'admin' && role !== 'editor') {
      return res.status(403).json({ message: 'У вас нет прав для редактирования проекта.' });
    }

    // Проверка, существует ли проект
    const portfolio = await Portfolio.findById(id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Проект не найден.' });
    }

    // Проверка, что редактор может редактировать только свои проекты
    if (role === 'editor' && portfolio.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Редакторы могут редактировать только свои проекты.' });
    }

    // Обновление проекта
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id,
      { title, description, images },
      { new: true }
    );

    res.status(200).json({ message: 'Проект успешно обновлён.', portfolio: updatedPortfolio });
  } catch (error) {
    console.error('Ошибка при обновлении портфолио:', error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};



// Удаление проекта
exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    // Проверка роли
    if (role !== 'admin') {
      return res.status(403).json({ message: 'У вас нет прав для удаления проекта.' });
    }

    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
    if (!deletedPortfolio) {
      return res.status(404).json({ message: 'Проект не найден.' });
    }

    res.status(200).json({ message: 'Проект успешно удалён.' });
  } catch (error) {
    console.error('Ошибка при удалении портфолио:', error);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

