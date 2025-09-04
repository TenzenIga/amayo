# Клон Reddit
Это пет проект клон Reddit создавался с целью обучения и тестирования разных технологий. Тут я периодически обновляю ангуляр, добавляю новые фичи и фиксы. 
Недавно настроил ci/cd с github actions и выкатил проект на VPS  
https://www.amayo.ru/

Функционал пока минимальный: можно создавать посты и сообщества, оставлять комментарии, голосовать за посты и комменты и загружать картинки к постам. Добавлена темная тема. 
Качество кода тут не самое лучшее, это больше проект для себя. Проект к которому я возвращаюсь раз в год и пытаюсь вспомнить что же я тут делал. Поэтому тут нет тестов и каких-то жестких архитектурных рамок. Большая часть стейт менеджмента реализована на ngrx

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
