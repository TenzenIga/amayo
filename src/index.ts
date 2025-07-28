import "reflect-metadata";
import { createConnection } from "typeorm";
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config()


import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import subRoutes from './routes/subs';
import miscRoutes from './routes/misc';
import userRoutes from './routes/users';
import trim from "./middleware/trim";
import path from "path";

const app = express();


app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());



app.use(express.static('public'))
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


app.listen(3000, async () => {
  console.log('Server running at http://localhost:3000');

  try {
    await createConnection();
    console.log('Database connected');
  } catch (err) {
    console.log(err);
  }
})