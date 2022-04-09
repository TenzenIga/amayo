import { ConnectionOptions } from "typeorm";

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
  entities: [rootDir + '/entity/**/*{.ts,.js}'],
  migrations: [rootDir + '/migration/**/*{.ts,.js}'],
  cli: {
    entitiesDir: rootDir + '/entitiy',
    migrationsDir: rootDir + '/migration',
  },
} 

export default conn;