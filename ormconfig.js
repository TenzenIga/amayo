const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'build';

module.exports = {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: true,
    logging: true,
    entities: [rootDir + '/entity/**/*{.ts,.js}'],
    migrations: [rootDir + '/migration/**/*{.ts,.js}'],
    subscribers: [rootDir + '/subscribers/**/*{.ts,.js}'],
    cli: {
      entitiesDir: rootDir + '/entities',
      migrationsDir: rootDir + '/migrations',
      subscribersDir: rootDir + '/subscribers',
    },
  }