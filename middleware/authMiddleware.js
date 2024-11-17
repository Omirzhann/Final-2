const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretkey123456789';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена или неправильный формат токена.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role || 'user',
    };
    next();
  } catch (error) {
    console.error('Ошибка в authMiddleware:', error.message);
    return res.status(401).json({ message: 'Недействительный токен.' });
  }
};
