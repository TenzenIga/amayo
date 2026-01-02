import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import subRoutes from './routes/subs';
import miscRoutes from './routes/misc';
import userRoutes from './routes/users';
import trim from './middleware/trim';
import path from 'path';
import { AppDataSource } from './data-source';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());

app.use(express.static('public'));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/subs', subRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/users', userRoutes);

// Отдача статики из Angular-сборки
app.use(express.static(path.join(__dirname, '../client/dist/client')));

// Все остальные запросы перенаправляем в Angular
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/client/index.html'));
});
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Инициализируем DataSource
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
