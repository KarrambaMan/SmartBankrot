const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg'); 

const pool = new Pool({ 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));


// Тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер работает!', status: 'OK' });
});

// Маршрут для получения списка должников из БД 
app.get('/api/debtors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM debtors ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении должников:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 API тест: http://localhost:${PORT}/api/test`);
  console.log(`👥 API должники: http://localhost:${PORT}/api/debtors`);
  console.log(`🌐 Разрешены запросы с: ${process.env.FRONTEND_URL}`);
});