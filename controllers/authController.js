const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Настройка данных
const JWT_SECRET = 'supersecretkey123456789';
const EMAIL_USER = 'creberbro@gmail.com';
const EMAIL_PASS = 'mbaf kvty wggv kjph';

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Хранилище OTP (в памяти)
const otpStorage = {};

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { username, password, firstName, lastName, age, gender } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
    }

    // Проверка на корректность данных
    if (!username || !password || !firstName || !lastName || !age || !gender) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля.' });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Установка роли: если это определённый email — назначаем "admin", иначе "editor"
    let role = "editor";
    if (username.toLowerCase() === "omirzhanb@example.com") {
      role = "admin";
    }

    // Создаём пользователя
    const user = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      age,
      gender,
      role, // Используем вычисленное значение role
    });

    await user.save();

    // Отправка приветственного письма
    const mailOptions = {
      from: EMAIL_USER,
      to: user.username, // Email пользователя
      subject: 'Добро пожаловать на нашу платформу!',
      html: `
        <h1>Здравствуйте, ${user.firstName}!</h1>
        <p>Вы успешно зарегистрировались на нашей платформе.</p>
        <p>Ваша текущая роль: <strong>${role === "admin" ? "Администратор" : "Редактор"}</strong>.</p>
        <p>Теперь вы можете войти в свой <a href="http://localhost:3000/login.html">личный кабинет</a>.</p>
        <p>С уважением, команда поддержки!</p>
      `,
    };

    // Обрабатываем результат отправки письма
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Ошибка при отправке письма:', error.message);
        return res.status(500).json({ message: 'Ошибка при отправке приветственного письма.' });
      } else {
        console.log('Приветственное письмо отправлено:', info.response);
      }
    });

    // Ответ клиенту
    res.status(201).json({ message: `Пользователь успешно зарегистрирован как ${role}.` });
  } catch (error) {
    console.error('Ошибка при регистрации:', error.message);
    res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
  }
};



// Вход пользователя с отправкой OTP
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage[username] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    await transporter.sendMail({
      from: EMAIL_USER,
      to: username,
      subject: 'Ваш OTP для входа',
      text: `Ваш OTP: ${otp}. Он действителен в течение 5 минут.`,
    });

    console.log(`OTP отправлен на ${username}: ${otp}`);
    res.status(200).json({ message: 'OTP отправлен на ваш email. Подтвердите его для входа.' });
  } catch (error) {
    console.error('Ошибка при входе:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

// Проверка OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res.status(400).json({ message: 'Email и OTP обязательны.' });
    }

    const storedOTP = otpStorage[username];
    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP не найден или истёк.' });
    }

    if (Date.now() > storedOTP.expiresAt) {
      delete otpStorage[username];
      return res.status(400).json({ message: 'OTP истёк.' });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: 'Неправильный OTP.' });
    }

    delete otpStorage[username];

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'OTP успешно подтверждён. Вход выполнен.', token });
  } catch (error) {
    console.error('Ошибка при проверке OTP:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

// Изменение роли пользователя
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Проверка роли текущего пользователя (доступ только для админа)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'У вас нет прав для изменения ролей.' });
    }

    // Проверяем, переданы ли необходимые данные
    if (!userId || !role) {
      return res.status(400).json({ message: 'Необходимо указать userId и role.' });
    }

    // Обновляем роль пользователя
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    res.status(200).json({ message: 'Роль пользователя успешно обновлена.', user });
  } catch (error) {
    console.error('Ошибка при обновлении роли:', error.message);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};