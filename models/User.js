const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  role: { type: String, default: 'editor' },
  is2FAEnabled: { type: Boolean, default: false },
});

// Middleware для хэширования пароля
userSchema.pre('save', async function (next) {
  try {
    // Проверяем, если поле "password" уже хэшировано
    if (!this.isModified('password')) {
      console.log('Пароль не изменён, пропускаем хэширование.');
      return next(); // Если пароль не изменён, пропускаем хэширование
    }

    // Проверяем, если пароль уже выглядит как хэш
    if (this.password.startsWith('$2a$')) {
      console.log('Пароль уже хэширован, пропускаем.');
      return next(); // Пропускаем, если это уже хэш
    }

    // Хэшируем пароль
    console.log('Хэширование пароля перед сохранением...');
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.error('Ошибка при хэшировании пароля:', error);
    next(error); // Передаём ошибку дальше
  }
});

// Метод для сравнения пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Ошибка при сравнении пароля');
  }
};

module.exports = mongoose.model('User', userSchema);
