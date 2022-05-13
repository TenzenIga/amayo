import { ConnectionOptions } from "typeorm";
import Comment from "./src/entity/Comment";
import Post from "./src/entity/Post";
import Sub from "./src/entity/Sub";
import User from "./src/entity/User";
import Vote from "./src/entity/Vote";

const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'build';

const conn: ConnectionOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  logging: true,
  entities: [
    Post,
    User,
    Sub,
    Comment,
    Vote
  ],
  migrations: [rootDir + '/migration/**/*{.ts,.js}'],
  cli: {
    entitiesDir: rootDir + '/entity',
    migrationsDir: rootDir + '/migration',
  },
} 

export default conn;