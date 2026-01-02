import Post from './entity/Post';
import User from './entity/User';
import Comment from './entity/Comment';
import { DataSource } from 'typeorm/index.js';
import Sub from './entity/Sub';
import Vote from './entity/Vote';
import Entity from './entity/Entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '5522',
  database: 'postgres',

  // Сущности
  entities: [Entity, Post, User, Comment, Sub, Vote], // Импортируйте явно

  migrations: ['src/migration/**/*.ts'],

  subscribers: ['src/subscribers/**/*.ts'],

  synchronize: true, // Только для разработки!
  logging: true,

  extra: {
    max: 10, // максимальное количество соединений в пуле
    connectionTimeoutMillis: 5000
  }
});

// Для использования в приложении
export default AppDataSource;
