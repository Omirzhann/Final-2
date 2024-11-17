const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const path = require('path');


// Настройка параметров подключения напрямую
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lomakasakaka:8QLvZpfxirX6hGty@cluster0.xvx7h.mongodb.net/final?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123456789';
const EMAIL_USER = process.env.EMAIL_USER || 'creberbro@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'yskd fqsf noci cnlb';

// Проверка наличия обязательных переменных
if (!MONGODB_URI || !JWT_SECRET || !EMAIL_USER || !EMAIL_PASS) {
  console.error('Ошибка: Отсутствуют обязательные переменные окружения.');
  process.exit(1);
}

// Подключение к MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const app = express();

// Middleware для парсинга URL и JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware для сессий
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Установка EJS как движка шаблонов
app.set('view engine', 'ejs');

// Проверка подключения маршрутов
try {
  if (!authRoutes || typeof authRoutes !== 'function') {
    throw new Error("'authRoutes' не является функцией маршрута.");
  }
  if (!portfolioRoutes || typeof portfolioRoutes !== 'function') {
    throw new Error("'portfolioRoutes' не является функцией маршрута.");
  }

  // Подключение маршрутов
  app.use('/auth', authRoutes);
  app.use('/portfolio', portfolioRoutes);
} catch (error) {
  console.error('Ошибка при подключении маршрутов:', error.message);
  process.exit(1);
}

// Подключение статических файлов (frontend)
app.use('/', express.static(path.join(__dirname, 'frontend')));

// Обработка неизвестных маршрутов
app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.message);
  if (!res.headersSent) {
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
