const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Проверяем, что функции контроллера определены
if (!authController.register) console.error("Error: 'register' function is not defined in authController");
if (!authController.login) console.error("Error: 'login' function is not defined in authController");
if (!authController.verifyOTP) console.error("Error: 'verifyOTP' function is not defined in authController");

// Маршрут для регистрации
router.post('/register', authController.register);

// Маршрут для входа
router.post('/login', authController.login);

// Маршрут для проверки OTP
router.post('/verify-otp', authController.verifyOTP);

// Эндпоинт для обновления роли пользователя (только для админа)
router.put('/update-role', authMiddleware, authController.updateUserRole);

// Экспорт маршрутов
module.exports = router;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzM5MWQxNTMyMGVhNGI1NDZiMmZlMzEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzE3OTkwODgsImV4cCI6MTczMTgwMjY4OH0.aMDRcoUWr0KlV6BnR__Jad7lpImjwRb0czdMsTeVETQ