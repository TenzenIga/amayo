# Клон Reddit
## Backend:
Express, postgres, typeorm

## frontend:
Angular, ngrx, bootstrap

## Database connection

create ormconfig.json with 
```json
{
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "*user_name",
    "password": "*password*",
    "database": "*db_name*",
    "synchronize": true,
    "logging": true,
    "entities": ["src/entity/**/*.ts"],
    "migrations": ["src/migration/**/*.ts"],
    "subscribers": ["src/subscribers/**/*.ts"],
    "seeds": ["src/seeds/**/*{.ts,.js}"],
    "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscribers"
    }
  }
```