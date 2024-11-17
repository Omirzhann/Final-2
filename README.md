# Платформа портфолио

## Описание проекта
Проект представляет собой платформу для управления портфолио с использованием Node.js, Express и MongoDB. Пользователи с различными ролями (*admin* и *editor*) могут создавать, редактировать или удалять элементы портфолио. Также предусмотрены автоматические уведомления по электронной почте.

---

## Основные функции
- Регистрация и вход с двухфакторной аутентификацией (OTP).
- Роли пользователей: *admin* и *editor*.
- Полный CRUD для портфолио (с ограничениями для роли *editor*).
- Уведомления на email с помощью Nodemailer:
  - Приветственное письмо после успешной регистрации.
  - Уведомление об ошибках входа после 3 неудачных попыток.

---

## Установка и запуск

### 1. Требования
- Node.js >= 14.x
- MongoDB

### 2. Установка
1. Склонируйте проект:
   ```bash
   git clone <ссылка на репозиторий>


Установите зависимости:
bash
Copy code
npm install
3. Настройка базы данных
Убедитесь, что ваш MongoDB настроен для доступа. В проекте используется URL подключения:

javascript
Copy code
MONGODB_URI = 'mongodb+srv://<пользователь>:<пароль>@<кластер>.mongodb.net/<база>';
4. Запуск проекта
Запустите сервер:

bash
Copy code
npm start
Сервер будет доступен по адресу http://localhost:3000.


API Endpoints
Пользователи
Регистрация: POST /auth/register
Тело запроса:
json
Copy code
{
  "username": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "gender": "male"
}
Вход: POST /auth/login
Тело запроса:
json
Copy code
{
  "username": "test@example.com",
  "password": "password123"
}
Проверка OTP: POST /auth/verify-otp
Тело запроса:
json
Copy code
{
  "username": "test@example.com",
  "otp": "123456"
}
Портфолио
Создание элемента: POST /portfolio/add
Тело запроса:
json
Copy code
{
  "title": "Project Title",
  "description": "Project Description",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
Получение всех элементов: GET /portfolio/
Обновление элемента: PUT /portfolio/update/:id
Тело запроса:
json
Copy code
{
  "title": "Updated Title",
  "description": "Updated Description",
  "images": ["https://example.com/newimage1.jpg"]
}
Удаление элемента: DELETE /portfolio/delete/:id