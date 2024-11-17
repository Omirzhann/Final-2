const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
  }

  try {
    const decoded = jwt.verify(token, 'your-jwt-secret');
    req.user = decoded; // добавляем данные пользователя в запрос
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный токен' });
  }
};
