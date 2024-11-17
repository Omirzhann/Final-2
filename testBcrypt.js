const bcrypt = require('bcryptjs');

const storedHash = "$2a$10$98ab4fHb3OJLfHKoUNP7Te5Kjfwh7Uv35sqTPMaKjSUF/6jLy9TM."; // Хэш из базы данных
const inputPassword = "TestPassword123!"; // Пароль, который вы пытаетесь проверить

bcrypt.compare(inputPassword, storedHash, (err, result) => {
  if (err) {
    console.error("Ошибка сравнения:", err);
  } else {
    console.log("Совпадение паролей:", result); // Должно быть true
  }
});
