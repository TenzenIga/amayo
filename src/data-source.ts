import Post from './entity/Post';
import User from './entity/User';
import Comment from './entity/Comment';
import Vote from './entity/Vote';
import Entity from './entity/Entity';
import { DataSource } from 'typeorm';
import Sub from './entity/Sub';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '5522',
  database: process.env.DB_DATABASE || 'postgres',

  entities: [Entity, Post, User, Comment, Sub, Vote],

  migrations: ['src/migration/**/*.ts'],

  subscribers: ['src/subscribers/**/*.ts'],

  synchronize: true,
  logging: true,

  extra: {
    max: 10, // максимальное количество соединений в пуле
    connectionTimeoutMillis: 5000
  }
});
